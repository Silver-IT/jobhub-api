import { BadRequestException, Injectable } from '@nestjs/common';
import { IsNull, LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as _ from 'underscore';

import { Project } from './entities/project.entity';
import { ImageAttachment } from './entities/image-attachment.entity';
import { ProjectAccessory } from './entities/project-accessory.entity';
import { Milestone } from './entities/milestone.entity';
import { FinalProposal } from './final-proposal/entities/final-proposal.entity';
import { CustomerProfile } from '../users/entities/customer-profile.entity';
import { PaymentAddOn } from '../payment/entities/payment-add-on.entity';
import { Refund } from '../payment/entities/refund.entity';
import { Estimate } from './estimate/entities/estimate.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import {
  EstimateStatus,
  MilestoneStatus,
  ProjectAccessoryType,
  ProjectLocationType,
  ProjectStatusFilterType,
} from './enums';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { ProjectAccessoryDto } from './dtos/project-accessory.dto';
import { RegisterProjectDto } from './dtos/register-project.dto';
import { ReportFilterDto } from '../common/dtos/report-filter.dto';
import { PaymentByDateDto, PaymentDto } from '../overview/dtos/payment.dto';
import { SuccessResponse } from '../common/models/success-response';
import { milestonePlan } from '../payment/data';
import { taxRate } from '../common/constants/general.constants';
import { UserRole } from '../common/enums/user-role.enum';
import { FinalProposalStatus } from './final-proposal/enums';
import { DateRangeDto } from '../common/dtos/date-range.dto';
import { formatTimeByUnit } from '../common/utils/time.util';
import { DEFAULT_FROM_DATE, DEFAULT_TO_DATE } from '../common/enums/time.enum';
import { MilestoneType, PaymentMethod } from '../payment/enums';
import { mergeArray } from '../common/utils/array.util';
import { getFromDto } from '../common/utils/repository.util';
import { SortByDateType } from '../common/enums/query.enum';

@Injectable()
export class ProjectService {

  constructor(
    @InjectRepository(Project) private readonly projectsRepository: Repository<Project>,
    @InjectRepository(ImageAttachment) private readonly imageAttachmentsRepository: Repository<ImageAttachment>,
    @InjectRepository(ProjectAccessory) private readonly projectAccessoriesRepository: Repository<ProjectAccessory>,
    @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Milestone) private milestoneRepository: Repository<Milestone>,
    @InjectRepository(Estimate) private estimateRepository: Repository<Estimate>,
    @InjectRepository(FinalProposal) private finalProposalRepository: Repository<FinalProposal>,
    @InjectRepository(PaymentAddOn) private paymentAddOnRepository: Repository<PaymentAddOn>,
    @InjectRepository(Refund) private refundRepository: Repository<Refund>,
  ) {
  }

  count(): Promise<number> {
    return this.projectsRepository.count();
  }

  async saveSchedules(schedules: Schedule[]): Promise<Schedule[]> {
    return this.scheduleRepository.save(schedules);
  }

  async addAttachments(attachmentUrls: string[]): Promise<ImageAttachment[]> {
    return this.imageAttachmentsRepository.save<ImageAttachment>(attachmentUrls.map(url => new ImageAttachment(url)));
  }

  async addProject(customer: CustomerProfile, projectDto: RegisterProjectDto): Promise<Project> {
    if (!projectDto.budget) {
      delete projectDto.budget;
    }
    const project = getFromDto<Project>(projectDto, new Project());
    project.customer = customer;
    project.attachments = await this.addAttachments(projectDto.attachments);
    project.accessories = await this.addAccessories(projectDto.accessories, projectDto.locationType);
    return this.projectsRepository.save(project);
  }

  async saveProject(project: Project): Promise<Project> {
    return this.projectsRepository.save(project);
  }

  saveMilestone(milestone: Milestone): Promise<Milestone> {
    return this.milestoneRepository.save(milestone);
  }

  async updateProject(projectId: string, data: UpdateProjectDto): Promise<Project> {
    let project = await this.findProjectById(projectId);
    if (!project) {
      throw new BadRequestException('Unable to update non-existing project.');
    }
    const newAttachments = await this.updateAttachments(data.attachments, project.attachments);
    const newAccessories = await this.updateAccessories(data.accessories, project.accessories);
    if (!data.budget) {
      delete data.budget;
    }
    project = getFromDto<Project>(data, new Project());
    project.attachments = newAttachments;
    project.accessories = newAccessories;
    project.id = projectId;

    await this.projectsRepository.save(project);
    return this.findProjectById(project.id);
  }

  async getPaymentByType(query: DateRangeDto): Promise<PaymentDto> {
    const rawResult = await this.milestoneRepository.createQueryBuilder('milestone')
      .select('milestone.paymentMethod', 'paymentMethod')
      .addSelect('SUM(milestone.amount)', 'amount')
      .where('milestone.paidDate is not null')
      .andWhere('milestone.paidDate >= :from', { from: query.from || DEFAULT_FROM_DATE })
      .andWhere('milestone.paidDate <= :to', { to: query.to || DEFAULT_TO_DATE })
      .addGroupBy('"paymentMethod"')
      .getRawMany();
    const stripe = rawResult.find(r => r.paymentMethod === PaymentMethod.CreditCard);
    const ach = rawResult.find(r => r.paymentMethod === PaymentMethod.Bank);
    const cash = rawResult.find(r => r.paymentMethod === PaymentMethod.Cash);
    return {
      stripe: stripe ? Number(stripe.amount) : 0,
      ach: ach ? Number(ach.amount) : 0,
      cash: cash ? Number(cash.amount) : 0,
    };
  }

  async getPaymentHistory(query: ReportFilterDto): Promise<PaymentByDateDto[]> {
    const rawResult = await this.milestoneRepository.createQueryBuilder('milestone')
      .select(`TO_CHAR(milestone.paidDate, '${formatTimeByUnit(query.unit)}') AS "date"`)
      .addSelect('milestone.paymentMethod', 'paymentMethod')
      .addSelect('SUM(milestone.amount)', 'amount')
      .where('milestone.paidDate is not null')
      .andWhere('milestone.paidDate >= :from', { from: query.from || DEFAULT_FROM_DATE })
      .andWhere('milestone.paidDate <= :to', { to: query.to || DEFAULT_TO_DATE })
      .groupBy('"date"')
      .addGroupBy('"paymentMethod"')
      .getRawMany();
    const grouped = _.groupBy(rawResult, r => r.date);
    return Object.keys(grouped).map(key => {
      const stripe = grouped[key].find(g => g.paymentMethod === PaymentMethod.CreditCard);
      const ach = grouped[key].find(g => g.paymentMethod === PaymentMethod.Bank);
      const cash = grouped[key].find(g => g.paymentMethod === PaymentMethod.Cash);
      return {
        date: key,
        stripe: stripe ? Number(stripe.amount) : 0,
        ach: ach ? Number(ach.amount) : 0,
        cash: cash ? Number(cash.amount) : 0,
      };
    });
  }

  async getYtd(): Promise<number> {
    const fromDate = new Date();
    fromDate.setMonth(0);
    fromDate.setDate(0);
    fromDate.setHours(0);
    fromDate.setMinutes(0);
    fromDate.setSeconds(0);
    fromDate.setMilliseconds(0);
    const milestones = await this.milestoneRepository.find({ paidDate: MoreThan(fromDate) });
    const addOns = await this.paymentAddOnRepository.find({ paidDate: MoreThan(fromDate) });
    const totalRevenue = milestones.reduce((sum, milestone) => sum + milestone.amount, 0) +
      addOns.reduce((sum, addOn) => sum + addOn.amount, 0);
    return Math.round(totalRevenue * 100) / 100;
  }

  async updateAttachments(attachmentUrls: string[], originalAttachments?: ImageAttachment[]): Promise<ImageAttachment[]> {
    let attachments = attachmentUrls.map(url => new ImageAttachment(url));

    if (originalAttachments) {
      attachments = mergeArray(originalAttachments, attachments, 'url');
    }
    return this.imageAttachmentsRepository.save(attachments);
  }

  async updateAccessories(accessoryDetails: ProjectAccessoryDto[], originalAccessories?: ProjectAccessory[]): Promise<ProjectAccessory[]> {
    if (originalAccessories) {
      originalAccessories.forEach(originalAccessory => {
        const accessory = accessoryDetails.find(a => a.id === originalAccessory.id);
        if (!accessory) {
          return;
        }
        originalAccessory.comment = accessory.comment;
        originalAccessory.groundState = accessory.groundState;
        originalAccessory.locationType = accessory.locationType;
        originalAccessory.materials = accessory.materials;
        originalAccessory.shape = accessory.shape;
        originalAccessory.size = accessory.size;
        originalAccessory.type = accessory.type;
      });
      accessoryDetails = mergeArray(originalAccessories, accessoryDetails);
    }
    return this.projectAccessoriesRepository.save(
      accessoryDetails.map(accessoryDto => {
        const accessory = getFromDto<ProjectAccessory>(accessoryDto, new ProjectAccessory());
        if (!accessory.id) {
          delete accessory.id;
        }
        if (!accessory.locationType) {
          delete accessory.locationType;
        }
        if (!accessory.shape) {
          delete accessory.shape;
        }
        return accessory;
      }));
  }

  async addFullProjects(projects: Project[]): Promise<Project[]> {
    for (let i = 0; i < projects.length; i++) {
      projects[i].accessories = await this.updateAccessories(projects[i].accessories);
      projects[i].attachments = await this.imageAttachmentsRepository.save(projects[i].attachments);
      projects[i].estimateReminderSent = true;
    }
    return this.projectsRepository.save(projects);
  }

  async addAccessories(accessoryTypes: ProjectAccessoryType[], locationType: ProjectLocationType): Promise<ProjectAccessory[]> {
    const accessories = accessoryTypes.map(accessoryType => {
      const accessory = new ProjectAccessory();
      accessory.type = accessoryType;
      accessory.locationType = locationType;
      return accessory;
    });
    return this.projectAccessoriesRepository.save(accessories);
  }

  async findProjects(contractorId: string, sortByDateType: SortByDateType, status: ProjectStatusFilterType, projectType: ProjectAccessoryType, skip: number, take: number): Promise<[Project[], number]> {
    let statusFilter = 'TRUE';
    if (status === ProjectStatusFilterType.EstimatePending) {
      statusFilter = 'project.estimate is null';
    } else if (status === ProjectStatusFilterType.FinalProposalPending) {
      statusFilter = 'project.estimate is not null and project.finalProposal is null and estimate.status = \'SITE_VISIT_SCHEDULED\'';
    } else if (status === ProjectStatusFilterType.InProgress) {
      statusFilter = 'project.estimate is not null and project.finalProposal is not null and finalProposal.status = \'ACCEPTED\'';
    } else if (status === ProjectStatusFilterType.FinalProposalSent) {
      statusFilter = 'project.estimate is not null and project.finalProposal is not null and finalProposal.status = \'PENDING\'';
    }
    const [projects, count] = await this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('user.patioPackage', 'patioPackage')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor.user')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('estimate.siteVisitSchedules', 'siteVisitSchedules')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .where(contractorId ? `contractor.id = '${contractorId}'` : '')
      .andWhere(statusFilter)
      .andWhere(projectType ? 'project.projectType = :projectType' : 'TRUE', { projectType })
      .addOrderBy('project.createdAt', sortByDateType === SortByDateType.MostRecent ? 'DESC' : 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return [projects, count];
  }

  async requestReleaseMilestone(milestoneId: string): Promise<Milestone> {
    const milestone = await this.findMilestoneById(milestoneId);
    milestone.status = MilestoneStatus.ReleaseRequested;
    return this.milestoneRepository.save(milestone);
  }

  async setGovernmentConfirmed(id: string, comment: string): Promise<SuccessResponse> {
    const updateResult = await this.projectsRepository.update({ id }, {
      governmentConfirmed: true,
      governmentCallComment: comment,
    });
    return new SuccessResponse(Boolean(updateResult.affected));
  }

  async findProjectById(id: string, user?: any): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      relations: [
        'customer',
        'customer.user',
        'customer.user.patioPackage',
        'contractor',
        'contractor.user',
        'attachments',
        'accessories',
        'estimate',
        'estimate.siteVisitSchedules',
        'finalProposal',
        'milestones',
        'refund',
        'milestones.paymentAddOns',
        'pickOutPaverSchedule',
      ],
      where: {
        id,
      },
    });
    if (!project) {
      throw new BadRequestException('Could not find requested project.');
    }
    project.attachments = project.attachments.filter(a => !Boolean(a.deletedAt));
    project.accessories = project.accessories.filter(a => !Boolean(a.deletedAt));
    project.user = project.customer.user;
    if (project.contractor) {
      project.assignedContractor = project.contractor.user;
    }
    if (project.milestones && project.milestones.length) {
      const finalMilestone = project.milestones.find(m => m.order === MilestoneType.Final);
      const holdMilestone = project.milestones.find(m => m.order === MilestoneType.Hold);
      if (holdMilestone) {
        finalMilestone.hold = holdMilestone;
        const iHoldMilestone = project.milestones.findIndex(m => m.order === MilestoneType.Hold);
        project.milestones.splice(iHoldMilestone, 1);
      }
    }
    if (user) {
      if (user.role === UserRole.SuperAdmin) {
        return project;
      }
      if (project.customer.user.id === user.id) {
        return project;
      }
      if (project.contractor && project.contractor.user.id === user.id) {
        return project;
      }
      throw new BadRequestException('The project requested does not belong to you.');
    }
    return project;
  }

  async findProjectsByUserId(id: string, skip: number, take: number): Promise<[Project[], number]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('user.patioPackage', 'patioPackage')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('estimate.siteVisitSchedules', 'siteVisitSchedules')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .where('user.id = :id', { id })
      .addOrderBy('project.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async addPaymentAddOn(milestone: Milestone, amount: number, comment: string): Promise<PaymentAddOn> {
    const addOn = new PaymentAddOn();
    addOn.amount = amount;
    addOn.comment = comment;
    addOn.milestone = milestone;
    return this.paymentAddOnRepository.save(addOn);
  }

  async editPaymentAsCash(projectId: string, amount: number, comment: string): Promise<Milestone> {
    const project = await this.findProjectById(projectId);
    const finalMilestone = project.milestones.find(milestone => milestone.order === MilestoneType.Final);
    finalMilestone.comment = comment;
    finalMilestone.amount = amount;
    finalMilestone.payWithCash = true;
    return this.milestoneRepository.save(finalMilestone);
  }

  async findAddOnById(id: string): Promise<PaymentAddOn> {
    return this.paymentAddOnRepository.findOne({
      relations: ['milestone', 'milestone.project'],
      where: { id },
    });
  }

  async removeAddOn(addOn: PaymentAddOn): Promise<Milestone[]> {
    const projectId = addOn.milestone.project.id;
    const milestones = await this.findMilestonesByProjectId(projectId);
    if (addOn.milestone.order === MilestoneType.Deposit) {
      const finalMilestone = milestones.find(m => m.order === MilestoneType.Final);
      finalMilestone.amount += addOn.amount;
      await this.updateMilestone(finalMilestone);
    }
    await this.paymentAddOnRepository.remove(addOn);
    return this.findMilestonesByProjectId(projectId);
  }

  async addRefund(projectId: string, amount: number, comment: string): Promise<Refund> {
    const project = await this.findProjectById(projectId);
    if (project.refund) {
      throw new BadRequestException('There is already a refund made on this project.');
    }
    const refund = new Refund();
    refund.amount = amount;
    refund.project = project;
    refund.comment = comment;
    return this.refundRepository.save(refund);
  }

  async findProjectsByCustomerId(id: string, skip: number, take: number): Promise<[Project[], number]> {
    const [projects, count] = await this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('user.patioPackage', 'patioPackage')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('estimate.siteVisitSchedules', 'estimate.siteVisitSchedules')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .where('customer.id = :id', { id })
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return [projects, count];
  }

  async findProjectsByContractorId(id: string, skip: number, take: number): Promise<[Project[], number]> {
    const [projects, count] = await this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'user')
      .leftJoinAndSelect('user.patioPackage', 'patioPackage')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor.user')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('estimate.siteVisitSchedules', 'estimate.siteVisitSchedules')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .where('contractor.id = :id', { id })
      .addOrderBy('project.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
    return [projects, count];
  }

  async findSignedProposalsByUserId(id: string, skip: number, take: number): Promise<[Project[], number]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer.user')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor.user')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .leftJoinAndSelect('project.milestones', 'milestones')
      .where('customer.user.id = :id', { id })
      .andWhere('project.contractSignedDate is not null')
      .addOrderBy('project.createdAt', 'ASC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  async getEstimatePendingProjects(): Promise<Project[]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor.user')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer.user')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .where('project.estimate is null')
      .getMany();
  }

  async deleteOne(id: string): Promise<SuccessResponse> {
    const project = await this.projectsRepository.findOne({
      withDeleted: true,
      relations: ['estimate', 'finalProposal', 'estimate.siteVisitSchedules'],
      where: { id },
    });
    if (project.estimate) {
      if (project.estimate.siteVisitSchedules) {
        await this.scheduleRepository.softRemove(project.estimate.siteVisitSchedules);
      }
      await this.estimateRepository.softRemove(project.estimate);
    }
    if (project.finalProposal) {
      await this.finalProposalRepository.softRemove(project.finalProposal);
    }
    await this.projectsRepository.softDelete({ id });
    return new SuccessResponse(true);
  }

  async setEstimateReminderEmailSent(project: Project): Promise<Project> {
    project.estimateReminderSent = true;
    return this.projectsRepository.save(project);
  }

  async findPendingProjects(skip, take): Promise<[Project[], number]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer.user')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .where('estimate is null')
      .addOrderBy('project.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();
  }

  findSiteVisitScheduleByDate(fromDate: Date, toDate: Date): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: ['estimate', 'estimate.project', 'estimate.project.customer', 'estimate.project.customer.user'],
      where: [
        { from: LessThanOrEqual(fromDate), to: MoreThan(fromDate), estimate: Not(IsNull()) },
        { from: MoreThanOrEqual(fromDate), to: LessThanOrEqual(toDate), estimate: Not(IsNull()) },
        { from: LessThan(toDate), to: MoreThanOrEqual(toDate), estimate: Not(IsNull()) },
      ],
    });
  }

  findProjectsByKeyword(keyword: string): Promise<Project[]> {
    return this.projectsRepository.createQueryBuilder('project')
      .where('LOWER(project.name) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.address) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.projectSize) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.requestDetails) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.manufacturer) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.productName) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.preferredSize) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.preferredTexture) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.additionalDesigns) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.exteriorUtilities) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.exteriorHazards) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.exteriorInconveniences) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.materialStorage) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.materialHaulOut) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.downSpouts) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.shrubRemoval) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(project.comment) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .getMany();
  }

  async makeMilestones(subTotalPrice: number, project: Project): Promise<Milestone[]> {
    const milestones = milestonePlan.map((plan, index) => {
      const milestone = new Milestone();
      milestone.project = project;
      milestone.name = plan.name;
      milestone.order = index;
      milestone.amount = subTotalPrice * plan.rate;
      milestone.comment = plan.comment;
      return milestone;
    });
    return this.milestoneRepository.save(milestones);
  }

  makeMilestonesFromProposal(proposal: FinalProposal): Promise<Milestone[]> {
    const totalPrice = proposal.costEstimates
      .reduce((sum, costEstimate) => sum + (costEstimate.accept ? costEstimate.cost : 0), 0);
    const tax = proposal.applyTax ? taxRate * (totalPrice - proposal.discount) : 0;
    return this.makeMilestones(totalPrice + tax - proposal.discount, proposal.project);
  }

  findMilestoneById(id: string): Promise<Milestone> {
    return this.milestoneRepository.findOne({
      relations: ['project', 'paymentAddOns'],
      where: { id },
    });
  }

  findRefundById(id: string): Promise<Refund> {
    return this.refundRepository.findOne({
      relations: ['project'],
      where: { id },
    });
  }

  removeRefund(refund: Refund) {
    this.refundRepository.remove(refund);
  }

  async findMilestonesByProjectId(id: string): Promise<Milestone[]> {
    const milestones = await this.milestoneRepository.createQueryBuilder('milestone')
      .leftJoinAndSelect('milestone.project', 'project')
      .leftJoinAndSelect('milestone.paymentAddOns', 'paymentAddOns')
      .where('project.id = :id', { id })
      .orderBy('milestone.order')
      .getMany();
    const holdMilestone = milestones.find(m => m.order === MilestoneType.Hold);
    const finalMilestone = milestones.find(m => m.order === MilestoneType.Final);
    if (finalMilestone && holdMilestone) {
      finalMilestone.hold = holdMilestone;
      const iHoldMilestone = milestones.findIndex(m => m.order === MilestoneType.Hold);
      milestones.splice(iHoldMilestone, 1);
    }
    return milestones;
  }

  removeMilestone(milestone: Milestone) {
    this.milestoneRepository.remove(milestone);
  }

  async updateMilestone(milestone: Milestone): Promise<Milestone> {
    return this.milestoneRepository.save(milestone);
  }

  async findMilestoneByPaymentId(paymentId: string): Promise<Milestone> {
    return this.milestoneRepository.findOne({ relations: ['paymentAddOns'], where: { paymentId } });
  }

  async setMilestonePaidByPaymentId(paymentId: string, paymentMethod: PaymentMethod): Promise<Milestone> {
    const milestone = await this.findMilestoneByPaymentId(paymentId);
    return this.setMilestonePaid(milestone, paymentMethod);
  }

  async setMilestonePaid(milestone: Milestone, paymentMethod: PaymentMethod): Promise<Milestone> {
    milestone.paidDate = new Date();
    milestone.status = MilestoneStatus.Released;
    milestone.paymentMethod = paymentMethod;
    const paymentAddOns = milestone.paymentAddOns.map(addOn => ({ ...addOn, paidDate: new Date() }));
    await this.paymentAddOnRepository.save(paymentAddOns);
    await this.updateMilestone(milestone);
    return this.findMilestoneById(milestone.id);
  }

  async isMilestonePaidByPaymentId(paymentId: string): Promise<boolean> {
    const milestone = await this.findMilestoneByPaymentId(paymentId);
    return Boolean(milestone.paidDate);
  }

  async findInProgressProjects(): Promise<Project[]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .where('finalProposal.status = :status', { status: FinalProposalStatus.Accepted })
      .getMany();
  }

  async findFinalProposalPendingProjects(): Promise<Project[]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .leftJoinAndSelect('project.finalProposal', 'finalProposal')
      .where('estimate.status = :status', { status: EstimateStatus.SiteVisitScheduled })
      .andWhere('project.finalProposal is null')
      .getMany();
  }

  async findEstimatePendingProjects(): Promise<Project[]> {
    return this.projectsRepository.createQueryBuilder('project')
      .leftJoinAndSelect('project.estimate', 'estimate')
      .where('estimate is null')
      .getMany();
  }

  async findProjectsWithValidAddress(): Promise<Project[]> {
    return this.projectsRepository.find({
      relations: ['customer', 'customer.user'],
      where: {
        latitude: Not(IsNull()),
        longitude: Not(IsNull()),
      },
    });
  }
}
