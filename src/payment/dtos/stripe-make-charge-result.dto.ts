import { ApiProperty } from '@nestjs/swagger';

export class StripePaymentIntentDto {
  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  publishableKey: string;
}
