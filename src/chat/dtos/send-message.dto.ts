import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SendMessageDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({ type: [String] })
  @IsOptional()
  @IsArray()
  readonly attachments?: string[];
}
