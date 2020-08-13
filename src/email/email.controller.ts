import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { EmailService } from './email.service';
import { EmailEventDto } from './dtos/email-event.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@ApiTags('Email')
@Controller('api/email')
export class EmailController {
  constructor(
    private emailService: EmailService,
  ) {
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: () => EmailEventDto, isArray: true })
  status(@Param('id') id: string): Promise<EmailEventDto[]> {
    return this.emailService.getEmailDetailStatus(id);
  }
}
