import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../auth/dtos/user.dto';

export class CustomerDto extends UserDto {
  @ApiProperty()
  readonly projectCount: number;

  @ApiProperty()
  readonly ideaCount: number;
}
