import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { SuccessResponse } from '../common/models/success-response';
import { ResetPasswordDto } from '../users/dtos/reset-pasword.dto';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangeProfileDto } from './dtos/change-profile.dto';
import { UserDto } from './dtos/user.dto';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import { InvitationStatus } from '../users/enums';
import { TokenResponse } from '../common/models/token-response';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.usersService.findUserByEmail(email);
    if (user && await compare(pass, user.password)) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { email: user.email, role: user.role, isEmailVerified: user.isEmailVerified, id: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async verifyEmailChange(token: string): Promise<TokenResponse> {
    const emailChangeLink = await this.usersService.findEmailChangeLinkById(token);
    if (!emailChangeLink) {
      throw new BadRequestException('The token is invalid.');
    }
    const user = await this.usersService.findUserByEmail(emailChangeLink.from);
    user.email = emailChangeLink.to;
    await this.usersService.updateUser(user);
    await this.usersService.deleteEmailChangeLink(emailChangeLink);
    return this.login(user);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.usersService.findUserByEmail(email);
  }

  async acceptInvite(body: AcceptInviteDto): Promise<TokenResponse> {
    const user = await this.usersService.findUserById(body.token);
    if (!user) {
      throw new BadRequestException('Invalid verification token.');
    }

    if (!await compare(body.temporaryPassword, user.password)) {
      throw new BadRequestException('You provided an incorrect temporary password.');
    }
    user.isEmailVerified = true;
    user.invitationStatus = InvitationStatus.Accepted; // set user invitation status to accepted
    await this.usersService.updateUser(user);

    await this.usersService.changePassword(user.email, body.password);
    return this.login(user);
  }

  async verifyEmail(uuid: string): Promise<SuccessResponse> {
    return this.usersService.verifyEmail(uuid);
  }

  async forgotPassword(email: string): Promise<string> {
    return await this.usersService.getResetPasswordToken(email);
  }

  async resetPassword(resetPasswordData: ResetPasswordDto): Promise<SuccessResponse> {
    const resetLink = await this.usersService.findResetLinkByToken(resetPasswordData.resetToken);
    if (!resetLink) {
      throw new BadRequestException('The reset link you provided is not valid.');
    }
    if (resetLink.expireDate < new Date()) {
      throw new BadRequestException('Password reset token has expired.');
    }
    return this.usersService.changePassword(resetLink.email, resetPasswordData.password);
  }

  async changePassword(id: string, changePasswordData: ChangePasswordDto): Promise<SuccessResponse> {
    const user = await this.usersService.findUserById(id);
    if (!await compare(changePasswordData.oldPassword, user.password)) {
      throw new BadRequestException('You provided an incorrect old password.');
    }
    return this.usersService.changePassword(user.email, changePasswordData.newPassword);
  }

  async changeProfile(id: string, changeProfileData: ChangeProfileDto): Promise<UserDto> {
    let user = await this.usersService.findUserById(id);
    user.phone = changeProfileData.phone;
    user.firstName = changeProfileData.firstName;
    user.lastName = changeProfileData.lastName;
    user.avatar = changeProfileData.avatar;
    user = await this.usersService.updateUser(user);
    return user.toUserDto();
  }
}
