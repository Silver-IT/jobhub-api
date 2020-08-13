import { ApiProperty } from '@nestjs/swagger';

export class VerifyPaymentDto {
  @ApiProperty()
  milestoneId: string;
}
