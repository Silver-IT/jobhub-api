import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { RegisterCustomerDto } from './dtos/register-customer.dto';
import { UsersService } from '../users/users.service';
import { CustomerDto } from '../users/dtos/customer.dto';
import { ProjectService } from '../project/project.service';
import { AuthService } from '../auth/auth.service';
import { IdeaBoardService } from '../idea-board/idea-board.service';
import { TokenResponse } from '../common/models/token-response';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { generateRandomPassword } from '../common/utils/string.util';
import { PaginationDto } from '../common/dtos/pagination.dto';
import {
  customerDefaultTakeCount,
  defaultTakeCount,
  projectDefaultTakeCount,
} from '../common/constants/general.constants';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { Project } from '../project/entities/project.entity';
import { SuccessResponse } from '../common/models/success-response';
import { NotificationService } from '../notification/notification.service';
import { EmailService } from '../email/email.service';
import { ContractService } from '../contract/contract.service';
import { CustomerVisitHistory } from '../customer-visit-history/entities/customer-visit-history.entity';
import { AddPageVisitHistoryDto } from '../customer-visit-history/dtos/add-page-visit-history.dto';
import { InvitationStatus } from '../users/enums';
import { SlackService } from '../slack/slack.service';
import { SlackMessageType } from '../slack/enums/slack-message-type.enum';
import { CustomerVisitHistoryService } from '../customer-visit-history/customer-visit-history.service';
import { LeadService } from '../lead/lead.service';
import { Lead } from '../lead/entities/lead.entity';
import { LeadStatus, LeadType } from '../lead/enums';
import { PatioPackage } from '../users/entities/patio-package.entity';
import { User } from '../users/entities/user.entity';
import { SearchByEmailDto } from './dtos/search-by-email.dto';

@ApiTags('Customer')
@Controller('api/customer')
export class CustomerController {

  constructor(
    private usersService: UsersService,
    private projectService: ProjectService,
    private authService: AuthService,
    private ideaBoardService: IdeaBoardService,
    private notificationService: NotificationService,
    private emailService: EmailService,
    private slackService: SlackService,
    private contractService: ContractService,
    private customerVisitHistoryService: CustomerVisitHistoryService,
    private leadService: LeadService,
  ) {
  }

  @ApiBearerAuth()
  @Post('invite')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: SuccessResponse })
  async invite(@Body() body: RegisterCustomerDto): Promise<any> {
    return this.registerCustomer(body, true);
  }

  @ApiBearerAuth()
  @Post(':id/send-invitation')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: SuccessResponse })
  async sendInvitation(@Param('id') id: string) {
    const user = await this.usersService.findUserById(id);
    const tempPassword = generateRandomPassword();
    user.password = tempPassword;
    await user.preProcess();
    await this.usersService.updateUser(user);
    await this.emailService.sendInvitationEmail(user, tempPassword);
    await this.usersService.setInvitationStatus(user, InvitationStatus.Sent);
    return new SuccessResponse(true);
  }

  @Post('register')
  @ApiOkResponse({ type: TokenResponse })
  async register(@Body() body: RegisterCustomerDto): Promise<any> {
    return this.registerCustomer(body, false);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @Get(':id/contracts')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => Project, isArray: true })
  async contracts(@Query() query: PaginationDto, @Param('id') id: string): Promise<PaginatorDto<Project>> {
    const [projects, count] = await this.projectService.findSignedProposalsByUserId(id, query.skip || 0, query.take || defaultTakeCount);
    return { data: projects, count };
  }

  @ApiBearerAuth()
  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: CustomerDto, isArray: true })
  async customers(@Query() query: PaginationDto): Promise<PaginatorDto<CustomerDto>> {
    const [data, count] = await this.usersService.findCustomers(query.skip || 0, query.take || customerDefaultTakeCount);
    return { data, count };
  }

  @ApiBearerAuth()
  @Get(':id/projects')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: () => PaginatorDto })
  async projects(@Param('id') id: string, @Query() query: PaginationDto): Promise<PaginatorDto<Project>> {
    const [data, count] = await this.projectService.findProjectsByUserId(id, query.skip || 0, query.take || projectDefaultTakeCount);
    data.forEach(project => project.user = project.customer.user);
    return {
      data,
      count,
    };
  }

  @ApiBearerAuth()
  @Post('search-by-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: () => User })
  async findCustomerByEmail(@Body() body: SearchByEmailDto): Promise<User> {
    const user = await this.usersService.findUserByEmail(body.email);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return user;
  }

  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: CustomerDto, isArray: true })
  async customer(@Param('id') id: string): Promise<CustomerDto> {
    return this.usersService.findCustomerById(id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @Post('page/visit')
  @ApiOkResponse({ type: () => CustomerVisitHistory })
  async addPageVisit(@Request() request, @Body() body: AddPageVisitHistoryDto): Promise<CustomerVisitHistory> {
    const project = await this.projectService.findProjectById(body.projectId);
    if (project) {
      return this.customerVisitHistoryService.logCustomerPageVisitHistory(body.page, project, body.id);
    } else {
      throw new BadRequestException('The requested entities does not exist. Please try again.');
    }
  }

  private async registerCustomer(body: RegisterCustomerDto, isInvite = false): Promise<SuccessResponse | TokenResponse | { projects: Project[] }> {
    const ideas = await this.ideaBoardService.findByIds(body.user.ideas);
    const userDto = { ...body.user, role: UserRole.Customer, sourceFoundUs: body.sourceFoundUs };
    if (isInvite) {
      userDto.password = generateRandomPassword();
    }
    const user = await this.usersService.addUser(userDto, ideas, true);

    if (isInvite) {
      // don't send invitation email
    } else {
      try {
        this.emailService.sendVerificationEmail(user).catch(err => console.log(err));
        this.slackService.sendNotification(SlackMessageType.NewUserRegistered, user).catch(err => console.log(err));
        const contractors = await this.usersService.findContractors();
        // set invitation email sent when a customer is self registered
        await this.usersService.setInvitationStatus(user, InvitationStatus.Accepted);
        await this.notificationService.userRegisteredEvent(contractors, user);
      } catch (e) {
        console.log(e);
      }
    }
    if (!body.patioPackage) {
      delete body.patioPackage;
    } else {
      body.patioPackage.user = user;
      body.patioPackage = await this.usersService.savePatioPackage(body.patioPackage);
      await this.saveLead(body, body.patioPackage as PatioPackage);
    }
    if (!isInvite) {
      await this.emailService.sendConsultationEmail(user);
    }
    const projects = await Promise.all(body.projects.map(projectDto => {
      const project = this.projectService.addProject(user.customerProfile, projectDto);
      this.leadService.updateLeadStatusByEmail(user.email, LeadStatus.Processed);
      return project;
    }));
    if (!user.address && projects.length !== 0) {
      user.address = projects[0].address;
      user.latitude = projects[0].latitude;
      user.longitude = projects[0].longitude;
      await this.usersService.updateUser(user);
    }
    await Promise.all(projects.map(async project => {
      const admins = await this.usersService.findSuperAdmins();
      return Promise.all(admins.map(admin => this.emailService.sendNewProjectEmail(admin, project)));
    }));
    if (isInvite) {
      return { projects };
    }
    return this.authService.login(user);
  }

  private async saveLead(payload: RegisterCustomerDto, patioPackage: PatioPackage) {
    const lead = new Lead();
    const user = payload.user;
    lead.type = LeadType.PatioPackage;
    lead.fullName = user.firstName + ' ' + user.lastName;
    lead.email = user.email;
    lead.phone = user.phone;
    lead.address = user.address;
    lead.latitude = user.latitude;
    lead.longitude = user.longitude;
    lead.sourceFoundUs = payload.sourceFoundUs;
    lead.message = '';
    lead.patioPackage = patioPackage;
    await this.leadService.add(lead);
  }
}
