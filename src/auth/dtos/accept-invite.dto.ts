import { IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AcceptInviteDto {
  @ApiProperty()
  @IsString()
  temporaryPassword: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsUUID()
  token: string;
}
