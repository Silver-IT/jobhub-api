import { ApiProperty } from '@nestjs/swagger';

export class EditMilestoneDto {
  @ApiProperty()
  amount: number;
}

export class EditFinalMilestoneDto extends EditMilestoneDto {
  @ApiProperty()
  comment: string;
}
