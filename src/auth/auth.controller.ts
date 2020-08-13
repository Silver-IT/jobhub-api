import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Put,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { UserDto } from './dtos/user.dto';
import { TokenResponse } from '../common/models/token-response';
import { SuccessResponse } from '../common/models/success-response';
import { ForgotPasswordDto } from '../users/dtos/forgot-password.dto';
import { LoginDto } from '../users/dtos/login.dto';
import { ResetPasswordDto } from '../users/dtos/reset-pasword.dto';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { ChangeProfileDto } from './dtos/change-profile.dto';
import { AcceptInviteDto } from './dtos/accept-invite.dto';
import { EmailService } from '../email/email.service';
import { VerifyEmailChangeDto } from './dtos/verify-email-change.dto';

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
  ) {
  }

  @ApiOkResponse({ type: TokenResponse })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }

  @ApiOkResponse({ type: SuccessResponse })
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto): Promise<SuccessResponse> {
    const user = await this.authService.findUserByEmail(body.email);
    if (!user) {
      throw new BadRequestException(`${body.email} is not a valid account.`);
    }
    const resetToken = await this.authService.forgotPassword(user.email);
    await this.emailService.sendResetPasswordEmail(user, resetToken);
    return new SuccessResponse(true);
  }

  @ApiOkResponse({ type: SuccessResponse })
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<SuccessResponse> {
    return this.authService.resetPassword(body);
  }

  @ApiOkResponse({ type: TokenResponse })
  @Post('accept-invite')
  async acceptInvite(@Body() body: AcceptInviteDto): Promise<TokenResponse> {
    return this.authService.acceptInvite(body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @Put('profile')
  async changeProfile(@Request() request, @Body() body: ChangeProfileDto): Promise<UserDto> {
    return this.authService.changeProfile(request.user.id, body);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: SuccessResponse })
  @Post('change-password')
  async changePassword(@Request() request, @Body() body: ChangePasswordDto): Promise<SuccessResponse> {
    return this.authService.changePassword(request.user.id, body);
  }

  @ApiOkResponse({ type: SuccessResponse })
  @Post('verify')
  async verifyAccount(@Body() body: VerifyEmailDto): Promise<SuccessResponse> {
    return this.authService.verifyEmail(body.verifyToken);
  }

  @ApiOkResponse({ type: TokenResponse })
  @Post('verify-email-change')
  async verifyEmailChange(@Body() body: VerifyEmailChangeDto): Promise<TokenResponse> {
    return this.authService.verifyEmailChange(body.verifyToken);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: UserDto })
  @Get()
  async getProfile(@Request() req): Promise<UserDto> {
    const email = req.user.email;
    const user: User = await this.authService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`Invalid user authorization token found.`);
    }
    return user.toUserDto();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: SuccessResponse })
  @Post('resend-verification')
  async resendVerificationEmail(@Request() req): Promise<SuccessResponse> {
    const user = await this.authService.findUserByEmail(req.user.email);
    await this.emailService.sendVerificationEmail(user);
    return new SuccessResponse(true);
  }
}
