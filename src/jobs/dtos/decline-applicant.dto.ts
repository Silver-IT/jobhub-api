import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeclineApplicantDto {
  // TODO: consider this dto when we are going to send an email to user for decline
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  readonly message: string;
}
