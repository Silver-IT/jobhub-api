import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ProjectService } from '../project/project.service';
import { EstimateService } from '../project/estimate/estimate.service';
import { JobsService } from '../jobs/jobs.service';
import { OverallStatsDto } from './dtos/overall-stats.dto';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { Project } from '../project/entities/project.entity';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { projectDefaultTakeCount } from '../common/constants/general.constants';
import { ProjectsStatDto } from './dtos/projects-stat.dto';
import { UsersService } from '../users/users.service';
import { PaymentByDateDto, PaymentDto } from './dtos/payment.dto';
import { ReportFilterDto } from '../common/dtos/report-filter.dto';
import { DateRangeDto } from '../common/dtos/date-range.dto';

@ApiTags('Overview')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRole.Contractor, UserRole.SuperAdmin])
@Controller('api/overview')
export class OverviewController {

  constructor(
    private readonly projectService: ProjectService,
    private readonly estimateService: EstimateService,
    private readonly jobService: JobsService,
    private readonly userService: UsersService,
  ) {
  }

  @Get('stats')
  @ApiOkResponse({ type: OverallStatsDto })
  async getOverallStats(): Promise<OverallStatsDto> {
    const stats = new OverallStatsDto();
    stats.applicants = await this.jobService.count();
    stats.customers = await this.userService.customerCount();
    stats.estimates = await this.estimateService.count();
    stats.projects = await this.projectService.count();
    stats.ytd = await this.projectService.getYtd();
    return stats;
  }

  @Get('pending-projects')
  @ApiOkResponse({ type: PaginatorDto })
  async getPendingProjects(@Query() query: PaginationDto): Promise<PaginatorDto<Project>> {
    const [data, count] = await this.projectService.findPendingProjects(query.skip || 0, query.take || projectDefaultTakeCount);
    data.forEach(item => {
      item.user = item.customer.user;
      delete item.customer;
    });
    return { data, count };
  }

  @Get('projects-stat')
  @ApiOkResponse({ type: ProjectsStatDto })
  async getProjectsStat(): Promise<ProjectsStatDto> {
    const inProgress = await this.projectService.findInProgressProjects();
    const estimatePending = await this.projectService.findEstimatePendingProjects();
    const proposalPending = await this.projectService.findFinalProposalPendingProjects();
    const siteVisitScheduled = await this.estimateService.findPendingSiteVisitSchedules();
    return {
      inProgress: inProgress.length,
      estimatePending: estimatePending.length,
      finalProposalPending: proposalPending.length,
      pendingSiteVisitSchedule: siteVisitScheduled.length,
    };
  }

  @Get('revenue/by-date')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Contractor])
  @ApiOkResponse({ type: () => PaymentByDateDto, isArray: true })
  async getPaymentHistory(@Query() query: ReportFilterDto): Promise<PaymentByDateDto[]> {
    return this.projectService.getPaymentHistory(query);
  }

  @Get('revenue/by-type')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin, UserRole.Contractor])
  @ApiOkResponse({ type: () => PaymentDto })
  async getPaymentByType(@Query() query: DateRangeDto): Promise<PaymentDto> {
    return this.projectService.getPaymentByType(query);
  }
}
