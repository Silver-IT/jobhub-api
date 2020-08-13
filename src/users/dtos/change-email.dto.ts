import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail()
  to: string;
}
