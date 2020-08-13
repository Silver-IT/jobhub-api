import { ApiProperty } from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty()
  readonly status: boolean;

  constructor() {
    this.status = true;
  }
}
