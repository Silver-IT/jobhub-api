import { ApiProperty } from '@nestjs/swagger';

import { EmailEventType } from '../enums';

export class EmailEventDto {
  @ApiProperty({ enum: EmailEventType })
  type: EmailEventType;

  @ApiProperty()
  processedAt: Date;

  @ApiProperty()
  reason: string;

  @ApiProperty()
  mailServer: string;
}
