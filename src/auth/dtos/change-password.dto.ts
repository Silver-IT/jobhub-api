import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
