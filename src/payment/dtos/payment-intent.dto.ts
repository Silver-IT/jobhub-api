import { ApiProperty } from '@nestjs/swagger';

export class PaymentIntentDto {
  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  publishableKey: string;
}
