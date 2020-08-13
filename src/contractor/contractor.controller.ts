import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('api/contractor')
@ApiTags('Contractor')
export class ContractorController {

  constructor(
    private usersService: UsersService,
  ) {
  }

  @ApiBearerAuth()
  @ApiOkResponse({ type: [User] })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @Get('all')
  all(): Promise<User[]> {
    return this.usersService.findContractors();
  }
}
