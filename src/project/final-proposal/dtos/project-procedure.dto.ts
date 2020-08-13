import { ApiProperty } from '@nestjs/swagger';

import { ProjectAccessoryType } from '../../enums';
import { ProcedureStepDto } from './procedure-step.dto';

export class ProjectProcedureDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty({ enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @ApiProperty({ type: () => ProcedureStepDto, isArray: true })
  steps: ProcedureStepDto[];
}
