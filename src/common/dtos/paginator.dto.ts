import { ApiProperty } from '@nestjs/swagger';

export class PaginatorDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  count: number;
}
