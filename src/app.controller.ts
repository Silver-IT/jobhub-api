import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponse } from './common/models/health-response';

@Controller('api')
export class AppController {

  @ApiTags('Others')
  @Get('status')
  @ApiOkResponse({ type: HealthResponse })
  health(): HealthResponse {
    return new HealthResponse();
  }
}
