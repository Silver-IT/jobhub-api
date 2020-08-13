import { ApiProperty } from '@nestjs/swagger';

import { ProjectAccessoryType } from '../../enums';
import { ImageAttachmentDto } from '../../dtos/image-attachment.dto';

export class AccessoryLayoutDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty()
  comment: string;

  @ApiProperty({ type: () => ImageAttachmentDto, isArray: true })
  attachments: ImageAttachmentDto[];
}
