import { ApiProperty } from '@nestjs/swagger';

export class SoftDeleteDto {
  @ApiProperty()
  id?: string;

  @ApiProperty()
  createdAt?: string;

  @ApiProperty()
  deletedAt?: string;

  @ApiProperty()
  updatedAt?: string;
}
