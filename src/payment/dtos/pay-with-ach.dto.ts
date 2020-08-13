import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class PayWithAchDto {
  @ApiProperty()
  @IsUUID()
  milestoneId: string;

  @ApiProperty()
  @IsString()
  plaidPublicToken: string;

  @ApiProperty()
  @IsString()
  plaidAccountId: string;
}
