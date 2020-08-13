import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, MoreThan, Repository } from 'typeorm';

import { Estimate } from './entities/estimate.entity';
import { EstimateItem } from './entities/estimate-item.entity';
import { Project } from '../entities/project.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { ContractorProfile } from '../../users/entities/contractor-profile.entity';
import { EstimateDto } from './dto/estimate.dto';
import { getFromDto } from '../../common/utils/repository.util';
import { SuccessResponse } from '../../common/models/success-response';
import { ScheduleType } from '../../schedule/enums';

@Injectable()
export class EstimateService {

  constructor(
    @InjectRepository(Estimate) private estimateRepository: Repository<Estimate>,
    @InjectRepository(EstimateItem) private estimateItemRepository: Repository<EstimateItem>,
    @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
  ) {
  }

  count(): Promise<number> {
    return this.estimateRepository.count();
  }

  findEstimateFromProjectId(projectId: string): Promise<Estimate> {
    return this.estimateRepository.createQueryBuilder('estimate')
      .leftJoinAndSelect('estimate.project', 'project')
      .leftJoinAndSelect('estimate.items', 'items')
      .leftJoinAndSelect('estimate.siteVisitSchedules', 'siteVisitSchedules')
      .where('project.id = :projectId', { projectId })
      .getOne();
  }

  async removeSiteVisitSchedule(id: string): Promise<SuccessResponse> {
    await this.scheduleRepository.delete({ id });
    return new SuccessResponse(true);
  }

  async updateEstimate(estimate: Estimate): Promise<Estimate> {
    await this.scheduleRepository.save(estimate.siteVisitSchedules);
    return this.estimateRepository.save(estimate);
  }

  async saveEstimate(project: Project, body: EstimateDto, contractor: ContractorProfile): Promise<Estimate> {
    const estimate = getFromDto<Estimate>(body, new Estimate());
    project.estimate = await this.estimateRepository.save(estimate);
    const items = body.items.map(item => {
      const t = getFromDto<EstimateItem>(item, new EstimateItem());
      t.estimate = estimate;
      return t;
    });
    await this.estimateItemRepository.save(items);
    if (body.siteVisitSchedules && body.siteVisitSchedules.length) {
      await this.scheduleRepository.save(body.siteVisitSchedules.map(schedule => {
        const t = getFromDto<Schedule>(schedule, new Schedule());
        t.type = ScheduleType.SiteVisitSchedule;
        t.estimate = estimate;
        return t;
      }));
    }
    project.contractor = contractor;
    await this.projectRepository.save(project);
    return this.findEstimateFromProjectId(project.id);
  }

  getSiteVisitPendingSchedules(): Promise<Schedule[]> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2); // 48 hours
    return this.scheduleRepository.find({
      relations: ['estimate', 'estimate.project', 'estimate.project.customer', 'estimate.project.customer.user', 'estimate.project.contractor', 'estimate.project.contractor.user'],
      where: {
        selected: true,
        reminderSent: false,
        from: Between(new Date(), tomorrow),
      },
    });
  }

  markSiteVisitScheduleReminderSent(schedule: Schedule): Promise<Schedule> {
    schedule.reminderSent = true;
    return this.scheduleRepository.save(schedule);
  }

  findPendingSiteVisitSchedules(): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      from: MoreThan(new Date()),
    });
  }

  findEstimateWithRange(dateFrom: string, dateTo: string, skip: number, take: number): Promise<[Estimate[], number]> {
    return this.estimateRepository.findAndCount({
      relations: ['project', 'project.user'],
      where: {
        createdAt: Between(new Date(dateFrom), new Date(dateTo)),
      },
      skip, take,
    });
  }

  getEmptyEstimateDtoFromProject(project: Project): EstimateDto {
    const estimate = new EstimateDto();
    estimate.projectType = project.projectType;
    estimate.materials = project.materials;
    estimate.locationType = project.locationType;
    estimate.projectSize = project.projectSize;
    estimate.shapeType = project.shapeType;
    estimate.requestDetails = project.requestDetails;
    estimate.coreProjectComment = project.comment;

    estimate.comment = '';
    estimate.timelineType = project.timelineType;
    estimate.items = project.accessories.map(accessory => {
      const estimateItem = new EstimateItem();
      estimateItem.size = accessory.size;
      estimateItem.materials = accessory.materials;
      estimateItem.locationType = accessory.locationType;
      estimateItem.comment = accessory.comment;
      estimateItem.type = accessory.type;
      estimateItem.pricePerUnit = 0;
      return estimateItem;
    });
    estimate.siteVisitSchedules = [];
    return estimate;
  }
}
