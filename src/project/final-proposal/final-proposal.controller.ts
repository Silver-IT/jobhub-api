import { BadRequestException, Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { EstimateService } from '../estimate/estimate.service';
import { FinalProposalService } from './final-proposal.service';
import { NotificationService } from '../../notification/notification.service';
import { UsersService } from '../../users/users.service';
import { EmailService } from '../../email/email.service';
import { ProjectService } from '../project.service';

import { FinalProposal } from './entities/final-proposal.entity';
import { Milestone } from '../entities/milestone.entity';

import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { SuccessResponse } from '../../common/models/success-response';

import { UserRole } from '../../common/enums/user-role.enum';
import { EstimateStatus } from '../enums';
import { FinalProposalStatus } from './enums';

import { FinalProposalDto } from './dtos/final-proposal.dto';
import { DeclineDto } from '../estimate/dto/decline.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AcceptProposalDto } from '../dtos/accept-proposal.dto';

@ApiTags('Project')
@UseGuards(JwtAuthGuard)
@Controller('api/project')
export class FinalProposalController {

  constructor(
    private estimateService: EstimateService,
    private finalProposalService: FinalProposalService,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private usersService: UsersService,
    private emailService: EmailService,
  ) {
  }

  @ApiBearerAuth()
  @Get(':id/final-proposal')
  @ApiOkResponse({ type: FinalProposalDto })
  async projectProposal(@Param('id') id: string): Promise<FinalProposalDto> {

    const finalProposal = await this.finalProposalService.findProposalFromProjectId(id);
    if (!finalProposal) {
      const estimate = await this.estimateService.findEstimateFromProjectId(id);
      if (!estimate || estimate.status !== EstimateStatus.SiteVisitScheduled) {
        throw new BadRequestException('Project estimate must accepted before creating a final proposal.');
      }
      return this.finalProposalService.getEmptyFinalProposalFromEstimate(estimate);
    }
    return finalProposal;
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':id/final-proposal/accept')
  @ApiOkResponse({ type: [Milestone] })
  async acceptProposal(@Request() request, @Param('id') id: string, @Body() body: AcceptProposalDto): Promise<Milestone[]> {
    const proposal = await this.finalProposalService.findProposalFromProjectId(id);
    proposal.costEstimates.forEach(item => item.accept = body.acceptedItems.indexOf(item.id) !== -1);
    await this.finalProposalService.updateCostEstimates(proposal.costEstimates);
    await this.projectService.makeMilestonesFromProposal(proposal);
    await this.updateStatus(id, request.user.id, FinalProposalStatus.Accepted);
    return this.projectService.findMilestonesByProjectId(id);
  }

  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @Roles([UserRole.Customer])
  @Post(':id/final-proposal/decline')
  @ApiOkResponse({ type: SuccessResponse })
  async declineProposal(@Request() request, @Param('id') id: string, @Body() body: DeclineDto): Promise<FinalProposal> {
    return this.updateStatus(id, request.user.id, FinalProposalStatus.Declined, body);
  }

  @ApiBearerAuth()
  @Post(':id/final-proposal')
  @ApiOkResponse({ type: FinalProposalDto })
  async updateProposal(@Request() request, @Param('id') id: string, @Body() body: FinalProposalDto): Promise<FinalProposalDto> {
    const estimate = await this.estimateService.findEstimateFromProjectId(id);
    const project = await this.projectService.findProjectById(id);
    if (!estimate) {
      throw new BadRequestException('Project estimate must be created before final proposal.');
    }
    if (estimate.status !== EstimateStatus.SiteVisitScheduled) {
      throw new BadRequestException('Final proposal can only be made for accepted estimates.');
    }
    if (request.user.role !== UserRole.SuperAdmin && project.contractor.user.id !== request.user.id) {
      throw new BadRequestException('This project is not assigned to you.');
    }
    if (body.id === '') {
      delete body.id;
    }
    if (!body.status) {
      delete body.status;
    }
    body.layouts.forEach(layout => {
      if (layout.id === '') {
        delete layout.id;
      }
    });
    body.costEstimates.forEach(costEstimate => {
      if (costEstimate.id === '') {
        delete costEstimate.id;
      }
    });
    body.procedures.forEach(procedure => {
      if (procedure.id === '') {
        delete procedure.id;
      }
      procedure.steps.forEach(step => {
        if (step.id === '') {
          delete step.id;
        }
      });
    });
    if (!body.discount) {
      body.discount = 0;
    }

    const finalProposal = await this.finalProposalService.findProposalFromProjectId(id);
    let result;
    const attachments = await this.projectService.addAttachments(body.attachments.map(attachment => attachment.url));
    if (!finalProposal) {
      result = await this.finalProposalService.saveProposal(project, attachments, body);
      this.emailService.sendReceivedFinalProposalEmail(project).catch(err => console.log(err));
    } else {
      body.id = finalProposal.id;
      result = await this.finalProposalService.saveProposal(project, attachments, body);
      this.emailService.sendFinalProposalUpdatedEmail(project).catch(err => console.log(err));
    }

    await this.notificationService.finalProposalSetEvent(project.customer.user, result);

    return result;
  }

  async updateStatus(projectId: string, userId: string, status: FinalProposalStatus, payload: DeclineDto = null): Promise<FinalProposal> {
    const project = await this.projectService.findProjectById(projectId);
    if (userId !== project.customer.user.id) {
      throw new BadRequestException('You are not allowed to accept/decline the proposal.');
    }
    const proposal = await this.finalProposalService.findProposalFromProjectId(projectId);
    if (proposal.status === FinalProposalStatus.Pending) {
      proposal.status = status;
      if (proposal.status === FinalProposalStatus.Declined) {
        proposal.declineComment = payload.declineComment;
        proposal.declineReasons = payload.declineReasons;
        this.emailService.sendFinalProposalDeclinedEmail(project, proposal);
      }
      await this.finalProposalService.updateProposal(proposal);
      const admins = await this.usersService.findSuperAdmins();
      const contractor = project.contractor ? project.contractor.user : null;
      await this.notificationService.finalProposalStatusChangedEvent(admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor], proposal);
      return this.finalProposalService.findProposalFromProjectId(project.id);
    } else if (proposal.status === status) {
      return this.finalProposalService.findProposalFromProjectId(project.id);
    } else {
      throw new BadRequestException('You are not allowed to change accepted/declined status.');
    }
  }
}
