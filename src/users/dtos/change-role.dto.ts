import { ApiProperty } from '@nestjs/swagger';

import { IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/user-role.enum';

export class ChangeRoleDto {
  @ApiProperty({ type: 'enum', enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;
}
