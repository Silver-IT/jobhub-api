import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyEmailChangeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  verifyToken: string;
}
