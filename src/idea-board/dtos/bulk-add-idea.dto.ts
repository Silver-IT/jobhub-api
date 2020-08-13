import { ApiProperty } from '@nestjs/swagger';

import { CreateIdeaBoardDto } from './create-idea-board.dto';

export class BulkAddIdeaDto {
  @ApiProperty({ type: CreateIdeaBoardDto, isArray: true })
  files: CreateIdeaBoardDto[];
}
