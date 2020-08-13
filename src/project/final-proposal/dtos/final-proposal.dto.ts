import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';

import { FinalProposalStatus } from '../enums';
import { ImageAttachment } from '../../entities/image-attachment.entity';
import { DeclineReason } from '../../estimate/enums';
import { AccessoryLayoutDto } from './accessory-layout.dto';
import { ProjectProcedureDto } from './project-procedure.dto';
import { ImageAttachmentDto } from '../../dtos/image-attachment.dto';
import { CostEstimateDto } from './cost-estimate.dto';

export class FinalProposalDto {
  @ApiProperty({ required: false })
  id?: string;

  @ApiProperty()
  @IsNotEmpty()
  existingSiteAssessment: string;

  @ApiProperty()
  @IsNotEmpty()
  paversSize: string;

  @ApiProperty()
  @IsNotEmpty()
  paversColor: string;

  @ApiProperty()
  @IsNotEmpty()
  paversQuality: string;

  @ApiProperty({ type: () => AccessoryLayoutDto, isArray: true })
  @ValidateNested({ each: true })
  layouts: AccessoryLayoutDto[];

  @ApiProperty()
  @IsNotEmpty()
  existingMaterialRemoval: string;

  @ApiProperty({ type: () => ProjectProcedureDto, isArray: true })
  @ValidateNested({ each: true })
  procedures: ProjectProcedureDto[];

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  workPlan: string;

  @ApiProperty({ type: () => ImageAttachmentDto })
  @ValidateNested({ each: true })
  attachments: ImageAttachment[];

  @ApiProperty({ type: () => CostEstimateDto })
  @ValidateNested({ each: true })
  costEstimates: CostEstimateDto[];

  @ApiProperty({ enum: FinalProposalStatus, required: false })
  status: FinalProposalStatus;

  @ApiProperty({ enum: DeclineReason, required: false })
  declineReasons: DeclineReason[];

  @ApiProperty({ required: false })
  declineComment: string;

  @ApiProperty({ required: false })
  discount: number;

  @ApiProperty({ required: true })
  applyTax: boolean;
}
