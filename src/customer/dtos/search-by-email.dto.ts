import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SearchByEmailDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
