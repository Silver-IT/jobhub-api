import { ApiProperty } from '@nestjs/swagger';

export class TotalUnreadDto {

  @ApiProperty()
  total: number;

}
