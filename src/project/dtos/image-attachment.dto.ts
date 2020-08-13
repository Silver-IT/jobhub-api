import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl, IsUUID } from 'class-validator';

export class ImageAttachmentDto {

  @ApiProperty({ required: false })
  @IsUUID()
  readonly id?: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  readonly url: string;
}
