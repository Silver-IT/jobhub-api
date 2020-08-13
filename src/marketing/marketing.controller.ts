import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MarketingService } from './marketing.service';
import { PageVisitHistory } from './entities/page-visit-history.entity';
import { LogPageVisitHistoryDto } from './dtos/log-page-visit-history.dto';
import { PageVisitHistoryOverviewDto } from './dtos/page-visit-history-overview.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ReportFilterDto } from '../common/dtos/report-filter.dto';
import { TimeUnit } from '../common/enums/time.enum';
import { SessionCountDto } from './dtos/session-count.dto';
import { ProjectService } from '../project/project.service';
import { ProjectBriefLocationDto } from './dtos/project-brief-location.dto';

@ApiTags('Marketing')
@Controller('api/marketing')
export class MarketingController {

  constructor(
    private readonly marketingService: MarketingService,
    private readonly projectService: ProjectService,
  ) {
  }

  @Post('page-visit')
  @ApiOkResponse({ type: PageVisitHistory })
  logPageVisit(@Body() body: LogPageVisitHistoryDto): Promise<PageVisitHistory> {
    return this.marketingService.logPageVisitHistory(body);
  }

  @Get('page-visit')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: PageVisitHistoryOverviewDto, isArray: true })
  getPageVisitHistory(): Promise<PageVisitHistoryOverviewDto[]> {
    return this.marketingService.getPageVisitHistory();
  }

  @Get('session-count')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: SessionCountDto, isArray: true })
  getOverallTrafficHistory(@Query() query: ReportFilterDto): Promise<SessionCountDto[]> {
    query.unit = query.unit || TimeUnit.Hour;
    return this.marketingService.getOverallTrafficHistory(query);
  }

  @Get('projects')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: ProjectBriefLocationDto, isArray: true })
  async getProjects(): Promise<ProjectBriefLocationDto[]> {
    const projects = await this.projectService.findProjectsWithValidAddress();
    return projects.map(project => ({
      id: project.id,
      name: project.name,
      address: project.address,
      user: project.customer.user,
      latitude: project.latitude,
      longitude: project.longitude,
    }));
  }

}
