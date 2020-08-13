import { MessageFrom } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class MessageDto {
  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly chatId: string;

  @ApiProperty()
  readonly text: string;

  @ApiProperty({type: 'enum', enum: MessageFrom})
  readonly from: MessageFrom;

  @ApiProperty()
  readonly attachments: string[];

  @ApiProperty()
  readonly readAt: string;

  @ApiProperty()
  readonly createdAt: string;
}
