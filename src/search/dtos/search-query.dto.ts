import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SearchQueryDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly keyword: string;
}
