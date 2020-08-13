import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { isUUID } from '@nestjs/common/utils/is-uuid';

import { SuccessResponse } from '../common/models/success-response';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { projectDefaultTakeCount } from '../common/constants/general.constants';
import {
  RegisterProjectDto,
  RegisterProjectWithCustomerDto,
  RegisterProjectWithIdeasDto,
} from './dtos/register-project.dto';
import { UpdateProjectDto } from './dtos/update-project.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';
import { UsersService } from '../users/users.service';
import { NotificationService } from '../notification/notification.service';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { IdeaBoardService } from '../idea-board/idea-board.service';
import { Milestone } from './entities/milestone.entity';
import { ProjectsPaginationDto } from './dtos/projects-pagination.dto';
import { EmailService } from '../email/email.service';
import { EstimateService } from './estimate/estimate.service';
import { EstimateStatus, ProjectStatusFilterType } from './enums';
import { FinalProposalStatus } from './final-proposal/enums';
import { enumToLabel, generateRandomPassword } from '../common/utils/string.util';
import { TagService } from '../tag/tag.service';
import { TagCategory } from '../tag/enums/tag.enum';
import { ScheduleDto } from '../schedule/dtos/schedule.dto';
import { AddScheduleDto } from '../schedule/dtos/add-schedule.dto';
import { ScheduleService } from '../schedule/schedule.service';
import { EmailLog } from '../email/entities/email-status.entity';
import { CustomerVisitHistoryService } from '../customer-visit-history/customer-visit-history.service';
import { CustomerVisitHistory } from '../customer-visit-history/entities/customer-visit-history.entity';
import { SortByDateType } from '../common/enums/query.enum';
import { LeadStatus } from '../lead/enums';
import { LeadService } from '../lead/lead.service';
import { RegisterUserDto } from '../users/dtos/create-user.dto';
import { FinalProposalService } from './final-proposal/final-proposal.service';
import { MilestoneType } from '../payment/enums';
import { CostUnit } from './estimate/enums';
import { ScheduleStatus, ScheduleType } from '../schedule/enums';
import { ConfirmGovernmentCallDto } from './dtos/confirm-government-call.dto';

@ApiTags('Project')
@Controller('api/project')
export class ProjectController {

  constructor(
    private projectService: ProjectService,
    private usersService: UsersService,
    private ideaBoardService: IdeaBoardService,
    private estimateService: EstimateService,
    private finalProposalService: FinalProposalService,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private tagService: TagService,
    private scheduleService: ScheduleService,
    private customerVisitHistoryService: CustomerVisitHistoryService,
    private leadService: LeadService,
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  @Roles([UserRole.SuperAdmin])
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async delete(@Param('id') id: string): Promise<SuccessResponse> {
    await this.projectService.deleteOne(id);
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @Post(':id/schedule-pick-pavers')
  @ApiOkResponse({ type: () => ScheduleDto })
  @ApiImplicitParam({ name: 'id', required: true })
  async savePickPaversSchedule(@Param('id') id: string, @Body() body: AddScheduleDto): Promise<ScheduleDto> {
    const project = await this.projectService.findProjectById(id);
    let schedule = project.pickOutPaverSchedule;
    if (!schedule) {
      schedule = await this.scheduleService.addPickOutPaversSchedule(project, body.from, body.to);
    } else {
      schedule = await this.scheduleService.updateScheduleDate(schedule.id, body.from, body.to);
    }
    this.emailService.sendPickPaversScheduledEmail(project);
    this.notificationService.pickOutPaversScheduleUpdatedEvent(project.user, project);
    return schedule.toDto();
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  @Roles([UserRole.Contractor])
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Project })
  async update(@Request() request, @Param('id') id: string, @Body() body: UpdateProjectDto): Promise<Project> {
    if (!body.cleanUpType) {
      delete body.cleanUpType;
    }
    await this.tagService.addTag({ category: TagCategory.BrandManufacturer, text: body.manufacturer });
    await this.tagService.addTag({ category: TagCategory.ProductName, text: body.productName });
    await this.tagService.addTag({ category: TagCategory.PreferredSize, text: body.preferredSize });
    await this.tagService.addTag({ category: TagCategory.PreferredTexture, text: body.preferredTexture });
    const project = await this.projectService.updateProject(id, body);
    await this.notificationService.projectUpdatedEvent(project);
    return project;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get(':id/emails')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => EmailLog, isArray: true })
  async getEmailActivity(@Param('id') id: string): Promise<EmailLog[]> {
    const project = await this.projectService.findProjectById(id);
    const email = project.customer.user.email;
    const result = await this.emailService.findStatusesByProjectId(id, email);
    result.forEach(res => delete res.project);
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get(':id/customer-visit-history')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => CustomerVisitHistory, isArray: true })
  async getCustomerVisitHistory(@Param('id') id: string): Promise<CustomerVisitHistory[]> {
    const project = await this.projectService.findProjectById(id);
    if (project) {
      return this.customerVisitHistoryService.getCustomerVisitHistoryByProjectId(id);
    } else {
      throw new BadRequestException('Could not find requested project.');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Post(':id/continue-to-payment')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => Project })
  async continueToPayment(@Request() req, @Param('id') id: string): Promise<Project> {
    const contractor = await this.usersService.findContractorProfileByUserId(req.user.id);
    const project = await this.projectService.findProjectById(id);
    if (!project.budget) {
      throw new BadRequestException('You should have approximate total budget in order to continue the payment directly.');
    }
    const now = new Date();
    const estimate = project.estimate;
    if (!estimate) {
      const estimateDto = this.estimateService.getEmptyEstimateDtoFromProject(project);
      estimateDto.status = EstimateStatus.SiteVisitScheduled;
      estimateDto.costUnit = CostUnit.Total;
      estimateDto.pricePerUnit = 0;
      const schedule = new ScheduleDto();
      schedule.from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      schedule.to = new Date(schedule.from);
      schedule.to.setMinutes(30);
      schedule.status = ScheduleStatus.Expired;
      schedule.type = ScheduleType.SiteVisitSchedule;
      estimateDto.siteVisitSchedules = [schedule];
      project.estimate = await this.estimateService.saveEstimate(project, estimateDto, contractor);
    }
    if (!project.finalProposal) {
      project.estimate.items = project.estimate.items || [];
      const finalProposal = this.finalProposalService.getEmptyFinalProposalFromEstimate(project.estimate);
      finalProposal.status = FinalProposalStatus.Accepted;
      finalProposal.startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      finalProposal.endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      project.finalProposal = await this.finalProposalService.saveProposal(project, [], finalProposal);
    }
    const milestone = new Milestone();
    milestone.amount = project.budget;
    milestone.order = MilestoneType.Final;
    milestone.name = 'Project Completed';
    milestone.comment = 'Upon completion of project, when the project is complete conduct a final walk through with contractor and make payment.';
    milestone.project = project;
    project.milestones = [await this.projectService.saveMilestone(milestone)];
    await this.projectService.saveProject(project);

    const tempPassword = generateRandomPassword();
    const user = project.customer.user;
    user.password = tempPassword;
    await user.preProcess();
    await this.usersService.updateUser(user);
    await this.emailService.sendInvitationEmail(project.customer.user, tempPassword);

    return this.projectService.findProjectById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':id/reschedule-site-visit')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => SuccessResponse, isArray: true })
  async reschedule(@Request() request, @Param('id') id: string): Promise<SuccessResponse> {
    const project = await this.projectService.findProjectById(id);
    const admins = await this.usersService.findSuperAdmins();
    const contractor = project.contractor ? project.contractor.user : null;
    await this.notificationService.customerRescheduledSiteVisitEvent(admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor], project);
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @ApiImplicitParam({ name: 'id', required: true })
  @Post(':id/cancel-site-visit')
  @ApiOkResponse({ type: () => SuccessResponse, isArray: true })
  async cancelSiteVisit(@Request() request, @Param('id') id: string): Promise<SuccessResponse> {
    const project = await this.projectService.findProjectById(id);
    const estimate = await this.estimateService.findEstimateFromProjectId(id);
    estimate.status = EstimateStatus.Pending;
    await this.estimateService.updateEstimate(estimate);

    const admins = await this.usersService.findSuperAdmins();
    const contractor = project.contractor ? project.contractor.user : null;
    await this.notificationService.customerCanceledSiteVisitEvent(admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor], project);

    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get(':id/request-review')
  @ApiImplicitParam({ name: 'id', required: true })
  async requestReview(@Param('id') id: string): Promise<SuccessResponse> {
    const project = await this.projectService.findProjectById(id);
    await this.notificationService.contractorRequestedReviewEvent(project.user, project);
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Post(':id/confirm-government-call')
  @ApiImplicitParam({ name: 'id', required: true })
  confirmGovernmentCall(@Param('id') id: string, @Body() body: ConfirmGovernmentCallDto): Promise<SuccessResponse> {
    return this.projectService.setGovernmentConfirmed(id, body.comment || '');
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('all')
  @Roles([UserRole.Contractor, UserRole.Customer])
  @ApiOkResponse({ type: [Project] })
  async projects(@Query() query: ProjectsPaginationDto, @Request() request): Promise<PaginatorDto<Project>> {
    if (request.user.role === UserRole.Customer) {
      const user = await this.usersService.findUserById(request.user.id);
      if (user.patioPackage && !user.patioPackage.deletedAt) {
        const project = new Project();
        project.name = enumToLabel(user.patioPackage.packageType);
        project.updatedAt = user.updatedAt;
        project.patioPackageProject = true;
        return {
          data: [project],
          count: 1,
        };
      }
      const [data, count] = await this.projectService.findProjectsByCustomerId(user.customerProfile.id, query.skip || 0, query.take || projectDefaultTakeCount);
      data.forEach(project => project.user = project.customer.user);
      return { data, count };
    } else if (request.user.role === UserRole.SuperAdmin || request.user.role === UserRole.Contractor) {
      const contractorId = query.contractorId ? (await this.usersService.findUserById(query.contractorId)).contractorProfile.id : null;
      const sortByDateType = query.projectSortByDate || SortByDateType.MostRecent;
      const status = query.status || ProjectStatusFilterType.All;
      const [data, count] = await this.projectService.findProjects(contractorId, sortByDateType, status, query.projectType, query.skip || 0, query.take || projectDefaultTakeCount);
      data.forEach(project => project.user = project.customer.user);
      return { data, count };
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: Project })
  async projectDetails(@Request() request, @Param('id') id: string): Promise<Project> {
    if (!isUUID(id)) {
      throw new BadRequestException('Could not find requested project.');
    }
    return this.projectService.findProjectById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id/milestones')
  @ApiOkResponse({ type: [Milestone] })
  async milestones(@Param('id') id: string): Promise<Milestone[]> {
    const project = await this.projectService.findProjectById(id);
    if (project.finalProposal && project.finalProposal.status === FinalProposalStatus.Accepted) {
      return this.projectService.findMilestonesByProjectId(id);
    } else {
      throw new BadRequestException('Neither proposal nor contract was not made on this project.');
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('register-for-customer')
  @Roles([UserRole.SuperAdmin])
  @ApiOkResponse({ type: Project })
  async registerProjectForCustomer(@Request() request, @Body() body: RegisterProjectWithCustomerDto): Promise<Project> {
    const user = await this.usersService.findUserById(body.customerId);
    if (user.patioPackage) {
      await this.usersService.removePatioPackages(user.patioPackage);
    }
    const newProject = await this.projectService.addProject(user.customerProfile, body.project);
    this.leadService.updateLeadStatusByEmail(user.email, LeadStatus.Processed);
    return this.projectService.findProjectById(newProject.id);
  }

  @Post('register-from-lead/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: () => Project })
  @ApiImplicitParam({ name: 'id', required: true })
  async createProjectFromLead(@Param('id') leadId: string): Promise<Project> {
    const lead = await this.leadService.findLeadById(leadId);
    if (lead.status !== LeadStatus.Lead) {
      throw new BadRequestException('Creating project is not allowed for this lead.');
    }
    let user = await this.usersService.findUserByEmail(lead.email);
    if (!user) {
      const registerUserDto = RegisterUserDto.fromLead(lead);
      user = await this.usersService.addUser(registerUserDto);
      user = await this.usersService.findUserById(user.id);
    }
    const registerProjectDto = RegisterProjectDto.fromLead(lead);
    const project = await this.projectService.addProject(user.customerProfile, registerProjectDto);
    this.leadService.updateLeadStatusByEmail(user.email, LeadStatus.Processed);
    return this.projectService.findProjectById(project.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @ApiImplicitParam({ name: 'id', required: true })
  @Post(':id/request-pick-out-pavers-schedule-change')
  @ApiOkResponse({ type: () => SuccessResponse, isArray: true })
  async requestSiteVisitChange(@Param('id') id: string): Promise<SuccessResponse> {
    const project = await this.projectService.findProjectById(id);
    const admins = await this.usersService.findSuperAdmins();
    const contractor = project.contractor.user;
    const recipients = admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor];
    await this.notificationService.customerRequestedPickOutPaversChangeEvent(recipients, project);
    await Promise.all(recipients.map(r => this.emailService.sendPickPaversScheduleChangeRequestEmail(r, project)));
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('register')
  @Roles([UserRole.Customer])
  @ApiOkResponse({ type: SuccessResponse })
  async register(@Request() request, @Body() body: RegisterProjectWithIdeasDto): Promise<Project[]> {
    const userEmail = request.user.email;
    const user = await this.usersService.findUserByEmail(userEmail);
    if (user.patioPackage) {
      await this.usersService.removePatioPackages(user.patioPackage);
    }

    const projects = await this.registerProject(userEmail, body);

    if (!user.address) {
      user.address = projects[0].address;
      user.latitude = projects[0].latitude;
      user.longitude = projects[0].longitude;
      await this.usersService.updateUser(user);
    }

    await Promise.all(projects.map(async project => {
      const admins = await this.usersService.findSuperAdmins();
      return Promise.all(admins.map(admin => this.emailService.sendNewProjectEmail(admin, project)));
    }));
    return projects;
  }

  async registerProject(userEmail: string, body: RegisterProjectWithIdeasDto): Promise<Project[]> {
    const user = await this.usersService.findUserByEmail(userEmail);
    const ideas = await this.ideaBoardService.findByIds(body.ideas);
    user.ideas = [...user.ideas, ...ideas];
    await this.usersService.updateUser(user);
    const contractors = await this.usersService.findContractors();
    return Promise.all(body.projects.map(async project => {
      const newProject = await this.projectService.addProject(user.customerProfile, project);
      this.leadService.updateLeadStatusByEmail(user.email, LeadStatus.Processed);
      await this.notificationService.projectRegisteredEvent(contractors, newProject);
      return newProject;
    }));
  }
}
