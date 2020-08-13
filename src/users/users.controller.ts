import { BadRequestException, Body, Controller, Delete, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { ChangeRoleDto } from './dtos/change-role.dto';
import { UserDto } from '../auth/dtos/user.dto';
import { SuccessResponse } from '../common/models/success-response';
import { InviteUserDto } from './dtos/invite-user.dto';
import { EmailService } from '../email/email.service';
import { generateRandomPassword } from '../common/utils/string.util';
import { ChangeEmailDto } from './dtos/change-email.dto';

@ApiTags('User Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles([UserRole.SuperAdmin])
@Controller('api/user')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private emailService: EmailService,
  ) {
  }

  @Put(':id/change-role')
  @ApiOkResponse({ type: () => UserDto })
  @ApiParam({ name: 'id', required: true })
  async changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto): Promise<UserDto> {
    const user = await this.usersService.findUserById(id);
    if (!user) {
      throw new BadRequestException('The requested user does not exist. Please try again.');
    }
    user.role = dto.role;
    const updated = await this.usersService.updateUser(user);
    return updated.toUserDto();
  }

  @Put(':id/change-email')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: () => SuccessResponse })
  @ApiParam({ name: 'id', required: true })
  async changeEmail(@Param('id') id: string, @Body() body: ChangeEmailDto) {
    const user = await this.usersService.findUserById(id);
    const changeEmailLink = await this.usersService.addChangeEmailLink(user.email, body.to);
    this.emailService.sendEmailChangedEmail(user, body.to, changeEmailLink.id);
    return new SuccessResponse(true);
  }

  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => SuccessResponse })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<SuccessResponse> {
    return this.usersService.remove(id);
  }

  @ApiOkResponse({ type: () => UserDto })
  @Post('invite')
  async invite(@Body() dto: InviteUserDto): Promise<UserDto> {
    const user = await this.usersService.findUserByEmail(dto.email, true);
    if (user && user.deletedAt) {
      throw new BadRequestException('The user is marked as deleted.');
    }
    if (user) {
      throw new BadRequestException('The email address is already in use.');
    }
    const password = generateRandomPassword();
    const added = await this.usersService.addUser({ ...dto, password, ideas: [] });
    await this.emailService.sendInvitationEmail(added, password);
    return added.toUserDto();
  }
}
