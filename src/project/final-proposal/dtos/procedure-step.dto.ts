import { ApiProperty } from '@nestjs/swagger';

export class ProcedureStepDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  comment: string;
}
