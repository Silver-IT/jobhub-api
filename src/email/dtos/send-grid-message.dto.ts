import { ApiProperty } from '@nestjs/swagger';

export class SendGridMessageDto {
  @ApiProperty()
  from_email: string;

  @ApiProperty()
  msg_id: string;

  @ApiProperty()
  subject: string;

  @ApiProperty()
  to_email: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  opens_count: number;

  @ApiProperty()
  clicks_count: number;

  @ApiProperty()
  last_event_time: Date;
}
