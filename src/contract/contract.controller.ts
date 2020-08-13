import { BadRequestException, Controller, Param, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { SuccessResponse } from '../common/models/success-response';
import { Project } from '../project/entities/project.entity';

@ApiTags('Contract')
@Controller()
export class ContractController {

  constructor(
    private userService: UsersService,
    private projectService: ProjectService,
    private notificationService: NotificationService,
    private emailService: EmailService,
  ) {
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post('api/project/:id/sign-contract')
  @ApiOkResponse({ type: SuccessResponse })
  async requestContract(@Request() request, @Param('id') id: string): Promise<Project> {
    const user = await this.userService.findUserById(request.user.id);
    const project = await this.projectService.findProjectById(id);
    if (project.user.id !== user.id) {
      throw new BadRequestException('This project does not belong to you.');
    }
    const admins = await this.userService.findSuperAdmins();
    const contractor = project.contractor.user;
    project.contractSignedDate = new Date();
    await this.projectService.saveProject(project);
    await this.notificationService.customerSignedContractEvent(admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor], project);
    const emailRecipients = admins.find(a => a.id === contractor.id) ? admins : [...admins, contractor];
    await Promise.all(emailRecipients.map(async user => {
      return this.emailService.sendContractSignedEmail(user, project);
    }));
    return this.projectService.findProjectById(id);
  }
}
