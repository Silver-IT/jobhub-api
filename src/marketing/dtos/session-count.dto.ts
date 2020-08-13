import { ApiProperty } from '@nestjs/swagger';

export class SessionCountDto {

  @ApiProperty()
  date: string;

  @ApiProperty()
  count: number;
}
