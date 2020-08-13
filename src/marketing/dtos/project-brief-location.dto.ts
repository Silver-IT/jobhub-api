import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../users/entities/user.entity';

export class ProjectBriefLocationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty({ type: () => User })
  user: User;
}
