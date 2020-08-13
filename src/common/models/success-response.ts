import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SuccessResponse {
  @ApiProperty()
  @IsBoolean()
  readonly success: boolean;

  @ApiProperty()
  readonly message?: string;

  constructor(success: boolean, message = '') {
    this.success = success;
    this.message = message;
  }
}
