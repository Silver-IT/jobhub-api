import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { Job } from './entities/job.entity';
import { Applicant } from './entities/applicant.entity';
import { ApplyJobDto } from './dtos/apply-job.dto';
import { AddJobDto } from './dtos/add-job.dto';
import { JobsService } from './jobs.service';
import { SlackService } from '../slack/slack.service';
import { SlackMessageType } from '../slack/enums/slack-message-type.enum';
import { SuccessResponse } from '../common/models/success-response';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { jobsDefaultTakeCount } from '../common/constants/general.constants';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaginatorDto } from '../common/dtos/paginator.dto';

@ApiTags('Hiring')
@Controller('api/job')
export class JobsController {

  constructor(
    private jobService: JobsService,
    private slackService: SlackService,
  ) {
  }

  @Get('all')
  @ApiOkResponse({ type: Job, isArray: true })
  async getJobs(@Query() query: PaginationDto): Promise<PaginatorDto<Job>> {
    const [data, count] = await this.jobService.findAllJobs(query.skip || 0, query.take || jobsDefaultTakeCount);
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Post()
  @ApiOkResponse({ type: Job })
  createJob(@Body() body: AddJobDto): Promise<Job> {
    return this.jobService.addJob(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get('applicant/all')
  @ApiOkResponse({ type: Applicant, isArray: true })
  async getApplicants(@Query() query: PaginationDto): Promise<PaginatorDto<Applicant>> {
    const [data, count] = await this.jobService.findAllApplicants(query.skip || 0, query.take || jobsDefaultTakeCount);
    return { data, count };
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Post('applicant/:applicantId/decline')
  @ApiParam({ name: 'applicantId', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  declineApplicant(@Param('applicantId') id): Promise<SuccessResponse> {
    return this.jobService.deleteApplicant(id);
  }

  @Get(':jobId')
  @ApiParam({ name: 'jobId', required: true })
  @ApiOkResponse({ type: Job })
  getJob(@Param('jobId') jobId): Promise<Job> {
    return this.jobService.findJobById(jobId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Put(':jobId')
  @ApiParam({ name: 'jobId', required: true })
  @ApiOkResponse({ type: Job })
  updateJob(@Param('jobId') jobId, @Body() body: AddJobDto): Promise<Job> {
    return this.jobService.updateJob(jobId, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Delete(':jobId')
  @ApiParam({ name: 'jobId', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteJob(@Param('jobId') jobId): Promise<SuccessResponse> {
    return this.jobService.deleteJob(jobId);
  }

  @Post(':jobId/apply')
  @ApiParam({ name: 'jobId', required: true })
  @ApiOkResponse({ type: ApplyJobDto })
  async applyForJob(@Param('jobId') jobId, @Body() body: ApplyJobDto): Promise<Applicant> {
    const data = await this.jobService.applyForJob(jobId, body);
    await this.slackService.sendNotification(SlackMessageType.ApplyForJob, data);
    return data;
  }
}
