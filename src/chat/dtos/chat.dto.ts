import { ApiProperty } from '@nestjs/swagger';

import { UserDto } from '../../auth/dtos/user.dto';
import { ProjectAccessoryType } from '../../project/enums';

export class ChatProjectBrief {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly name: string;

  @ApiProperty({ enum: ProjectAccessoryType })
  readonly projectType: ProjectAccessoryType;
}

export class ChatDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty({type: ChatProjectBrief})
  readonly project: ChatProjectBrief;

  @ApiProperty({type: UserDto})
  readonly customer: UserDto;

  @ApiProperty({type: UserDto})
  readonly contractor: UserDto;

  @ApiProperty()
  readonly unread: number;
}
