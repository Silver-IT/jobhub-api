import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { ProjectService } from '../project/project.service';
import { GoogleService } from '../google/google.service';
import { UsersService } from '../users/users.service';
import { EstimateService } from '../project/estimate/estimate.service';
import { NotificationService } from '../notification/notification.service';
import { FinalProposalService } from '../project/final-proposal/final-proposal.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ScheduleDto } from './dtos/schedule.dto';
import { ScheduleType } from './enums';
import { CalendarDto } from '../google/dtos/calendar.dto';
import { SuccessResponse } from '../common/models/success-response';
import { AddCalendarEventDto } from '../google/dtos/add-calendar-event.dto';
import { SearchScheduleDto } from './dtos/search-schedule.dto';
import { AddScheduleDto } from './dtos/add-schedule.dto';
import { EmailService } from '../email/email.service';
import { Schedule } from './entities/schedule.entity';
import { ScheduleService } from './schedule.service';

@ApiTags('Schedule')
@Controller('api/schedule')
export class ScheduleController {
  constructor(
    private projectService: ProjectService,
    private estimateService: EstimateService,
    private finalProposalService: FinalProposalService,
    private googleService: GoogleService,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private usersService: UsersService,
    private scheduleService: ScheduleService,
  ) {
  }

  @ApiBearerAuth()
  @Put(':id')
  @ApiOkResponse({ type: () => ScheduleDto })
  async updateSchedule(@Param('id') id: string, @Body() body: AddScheduleDto): Promise<ScheduleDto> {

    if (body.type === ScheduleType.ProjectStart) {
      const proposal = await this.finalProposalService.findById(id);
      proposal.startDate = body.from;
      proposal.endDate = body.to;
      await this.finalProposalService.updateProposal(proposal);
      return Schedule.toConstructionScheduleDto(proposal);
    }

    const updated = await this.scheduleService.updateScheduleDate(id, body.from, body.to);

    if (updated.type === ScheduleType.SiteVisitSchedule) {
      await this.notificationService.siteVisitScheduleUpdatedEvent(updated.estimate.project.customer.user, updated.estimate.project);
      this.emailService.sendSiteVisitScheduleChangedEmail(updated);
    } else if (updated.type === ScheduleType.PickOutPaver) {
      await this.notificationService.pickOutPaversScheduleUpdatedEvent(updated.project.customer.user, updated.project);
      this.emailService.sendPickPaversScheduleChangedEmail(updated);
    }
    return updated.toDto();
  }

  @ApiBearerAuth()
  @Put(':id/set-done')
  @ApiOkResponse({ type: () => ScheduleDto })
  async setScheduleDone(@Param('id') id: string): Promise<ScheduleDto> {
    const updated = await this.scheduleService.setDone(id, true);
    return updated.toDto();
  }


  @ApiBearerAuth()
  @Get()
  @ApiOkResponse({ type: () => ScheduleDto, isArray: true })
  async schedules(@Query() query: SearchScheduleDto): Promise<ScheduleDto[]> {
    const fromDate = query.from ? new Date(query.from) : new Date('2000-01-01');
    const toDate = query.to ? new Date(query.to) : new Date('2100-12-31');
    const siteVisits = await this.projectService.findSiteVisitScheduleByDate(fromDate, toDate);
    const proposals = await this.finalProposalService.findByDate(fromDate, toDate);
    const pickPavers = await this.scheduleService.findPickPaversScheduleByDate(fromDate, toDate);
    const siteVisitSchedules = siteVisits.map(s => s.toDto());
    const constructionSchedules = proposals.map(Schedule.toConstructionScheduleDto);
    const pickPaversSchedules = pickPavers.map(Schedule.toPickPaversScheduleDto);
    let schedules;
    if (!query.scheduleType) {
      schedules = [...siteVisitSchedules, ...pickPaversSchedules, ...(query.excludeConstructionSchedule ? [] : constructionSchedules)];
    } else if (query.scheduleType === ScheduleType.SiteVisitSchedule) {
      schedules = siteVisitSchedules;
    } else if (query.scheduleType === ScheduleType.ProjectStart) {
      schedules = constructionSchedules;
    } else if (query.scheduleType === ScheduleType.PickOutPaver) {
      schedules = pickPaversSchedules;
    }

    const sorted = schedules.sort((a, b) => a.from > b.from ? 1 : -1);
    if (query.take) {
      return query.to ? sorted : sorted.slice(0, query.take);
    }
    return sorted;
  }

  @ApiBearerAuth()
  @Delete(':id')
  @ApiOkResponse({ type: () => SuccessResponse })
  removeSchedule(@Param('id') id: string): Promise<SuccessResponse> {
    // TODO: add remove schedule handler here
    return this.estimateService.removeSiteVisitSchedule(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('calendars/:token')
  @ApiImplicitParam({ name: 'token', required: true })
  @ApiOkResponse({ type: CalendarDto, isArray: true })
  async getGoogleCalendars(@Param('token') token: string): Promise<CalendarDto[]> {
    return this.googleService.getCalendars(token).toPromise();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('calendars/:token/:calendarId')
  @ApiImplicitParam({ name: 'token', required: true })
  @ApiImplicitParam({ name: 'calendarId', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  addEventToGoogleCalendar(@Param('token') token: string, @Param('calendarId') calendarId: string, @Body() event: AddCalendarEventDto): Promise<SuccessResponse> {
    return this.googleService.addEventToCalendar(token, calendarId, event).toPromise();
  }

}
