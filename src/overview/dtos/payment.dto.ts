import { ApiProperty } from '@nestjs/swagger';

export class PaymentDto {
  @ApiProperty()
  stripe: number;

  @ApiProperty()
  ach: number;

  @ApiProperty()
  cash: number;
}

export class PaymentByDateDto extends PaymentDto {
  @ApiProperty()
  date: string;
}
