import { BadRequestException, Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { Estimate } from './entities/estimate.entity';
import { EstimateDto } from './dto/estimate.dto';
import { ProjectService } from '../project.service';
import { EstimateService } from './estimate.service';
import { NotificationService } from '../../notification/notification.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { EstimateStatus } from '../enums';
import { DeclineDto } from './dto/decline.dto';
import { PaginatorDto } from '../../common/dtos/paginator.dto';
import { EstimateQueryDto } from './dto/estimate-query.dto';
import { defaultTakeCount } from '../../common/constants/general.constants';
import { UsersService } from '../../users/users.service';
import { AcceptEstimateDto } from './dto/accept-estimate.dto';
import { EmailService } from '../../email/email.service';
import { SkipEstimateDto } from './dto/skip-estimate.dto';
import { Project } from '../entities/project.entity';
import { CostUnit } from './enums';
import { SuccessResponse } from '../../common/models/success-response';
import { ScheduleDto } from '../../schedule/dtos/schedule.dto';

@ApiTags('Project')
@Controller('api/project')
@UseGuards(JwtAuthGuard)
export class EstimateController {
  constructor(
    private projectService: ProjectService,
    private estimateService: EstimateService,
    private notificationService: NotificationService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {
  }

  @ApiBearerAuth()
  @Get('estimate/all')
  @ApiOkResponse({ type: PaginatorDto })
  async estimates(@Query() query: EstimateQueryDto): Promise<PaginatorDto<Estimate>> {
    const fromDate = query.from || new Date(2000, 1).toISOString();
    const toDate = query.to || new Date(2100, 12).toISOString();
    const [data, count] = await this.estimateService.findEstimateWithRange(fromDate, toDate, query.skip || 0, query.take || defaultTakeCount);
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @ApiImplicitParam({ name: 'id', required: true })
  @Post(':id/request-site-visit-change')
  @ApiOkResponse({ type: () => SuccessResponse, isArray: true })
  async requestSiteVisitChange(@Param('id') id: string): Promise<SuccessResponse> {
    const project = await this.projectService.findProjectById(id);
    const admins = await this.usersService.findSuperAdmins();
    const contractor = project.contractor.user;
    const recipients = admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor];
    await this.notificationService.customerRequestedSiteVisitChangeEvent(recipients, project);
    await Promise.all(recipients.map(r => this.emailService.sendSiteVisitScheduleChangeRequestEmail(r, project)));
    return new SuccessResponse(true);
  }

  @ApiBearerAuth()
  @Post(':id/skip-estimate')
  @ApiOkResponse({ type: Project })
  async skipEstimate(@Param('id') id: string, @Body() body: SkipEstimateDto): Promise<Project> {
    const project = await this.projectService.findProjectById(id);
    const contractorProfile = await this.usersService.findContractorProfileByUserId(body.contractorUserId);
    const estimateDto = this.estimateService.getEmptyEstimateDtoFromProject(project);
    estimateDto.costUnit = CostUnit.Total;
    estimateDto.pricePerUnit = 0;
    estimateDto.items.forEach(item => {
      item.costUnit = CostUnit.Total;
      item.pricePerUnit = 0;
    });
    const schedule = new ScheduleDto();
    schedule.from = body.siteVisitDateFrom;
    schedule.to = body.siteVisitDateTo;
    estimateDto.siteVisitSchedules = [schedule];
    estimateDto.status = EstimateStatus.SiteVisitScheduled;
    await this.estimateService.saveEstimate(project, estimateDto, contractorProfile);
    return this.projectService.findProjectById(id);
  }

  @ApiBearerAuth()
  @Get(':id/estimate')
  @ApiOkResponse({ type: Estimate })
  async projectEstimate(@Param('id') id: string) {
    const estimate = await this.estimateService.findEstimateFromProjectId(id);
    if (!estimate) {
      const project = await this.projectService.findProjectById(id);
      return this.estimateService.getEmptyEstimateDtoFromProject(project);
    }
    return estimate;
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Post(':id/estimate')
  @ApiOkResponse({ type: EstimateDto })
  async updateEstimate(@Param('id') id: string, @Body() body: EstimateDto): Promise<EstimateDto> {
    const project = await this.projectService.findProjectById(id);
    const estimate = await this.estimateService.findEstimateFromProjectId(id);
    const contractorProfile = await this.usersService.findContractorProfileByUserId(body.contractorUserId);
    let result;
    if (!body.requestDetails) {
      delete body.requestDetails;
    }
    if (!estimate) {
      result = await this.estimateService.saveEstimate(project, body, contractorProfile);
      await this.emailService.sendEstimateReadyEmail(project);
    } else {
      body.id = estimate.id;
      result = await this.estimateService.saveEstimate(project, body, contractorProfile);
      await this.emailService.sendEstimateUpdatedEmail(project);
    }
    await this.notificationService.estimateUpdatedEvent(project.customer.user, result);
    return result;
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':id/estimate/accept')
  @ApiOkResponse({ type: Estimate })
  async acceptEstimate(@Request() request, @Param('id') id: string, @Body() body: AcceptEstimateDto): Promise<Estimate> {
    const estimate = await this.estimateService.findEstimateFromProjectId(id);
    const project = await this.projectService.findProjectById(id);
    const schedule = estimate.siteVisitSchedules.find(s => s.id === body.scheduleId);
    await this.emailService.sendSiteVisitScheduledEmail(project, schedule.from);
    const customer = project.user;
    await this.emailService.sendSiteVisitRequestProposalEmail(`${customer.firstName} ${customer.lastName}`, schedule.from, project);
    return this.updateStatus(id, request.user.id, EstimateStatus.SiteVisitScheduled, body);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([UserRole.Contractor])
  @Post(':id/continue-to-proposal')
  @ApiOkResponse({ type: Estimate })
  async continueToProposal(@Request() request, @Param('id') id: string): Promise<Estimate> {
    const estimate = await this.estimateService.findEstimateFromProjectId(id);
    estimate.status = EstimateStatus.SiteVisitScheduled;
    await this.estimateService.updateEstimate(estimate);
    return this.estimateService.findEstimateFromProjectId(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':id/estimate/decline')
  @ApiOkResponse({ type: Estimate })
  async declineEstimate(@Request() request, @Param('id') id: string, @Body() body: DeclineDto): Promise<Estimate> {
    return this.updateStatus(id, request.user.id, EstimateStatus.Declined, body);
  }

  async updateStatus(projectId: string, userId: string, status: EstimateStatus, payload: DeclineDto | AcceptEstimateDto = null): Promise<Estimate> {
    const project = await this.projectService.findProjectById(projectId);
    if (userId !== project.customer.user.id) {
      throw new BadRequestException('You are not allowed to accept/decline the estimate.');
    }
    const estimate = await this.estimateService.findEstimateFromProjectId(projectId);
    if (estimate.status === EstimateStatus.Pending) {
      estimate.status = status;
      if (status === EstimateStatus.Declined) {
        estimate.declineComment = (payload as DeclineDto).declineComment;
        estimate.declineReasons = (payload as DeclineDto).declineReasons;
        this.emailService.sendEstimateDeclinedEmail(project, estimate);
      }
      await this.estimateService.updateEstimate(estimate);
      const admins = await this.usersService.findSuperAdmins();
      const contractor = project.contractor ? project.contractor.user : null;
      await this.notificationService.estimateStatusChangedEvent(admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor], estimate);
      return this.estimateService.findEstimateFromProjectId(projectId);
    } else if (estimate.status === status) {
      return this.estimateService.findEstimateFromProjectId(projectId);
    } else {
      throw new BadRequestException('You are not allowed to change accepted/declined status.');
    }
  }
}
