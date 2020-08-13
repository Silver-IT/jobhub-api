import { ApiProperty } from '@nestjs/swagger';
import { Optional } from '@nestjs/common';

export class SaveRecordingDto {

  @ApiProperty()
  recordingId: string;

  @ApiProperty({ required: false })
  @Optional()
  email?: string;

  @ApiProperty({ required: false })
  @Optional()
  firstName?: string;

  @ApiProperty({ required: false })
  @Optional()
  lastName?: string;
}
