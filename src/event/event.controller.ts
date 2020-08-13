import { Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { PaginationDto } from '../common/dtos/pagination.dto';
import { defaultTakeCount } from '../common/constants/general.constants';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SuccessResponse } from '../common/models/success-response';
import { EventService } from './event.service';
import { EventPagination } from './models/event-pagination';

@ApiTags('Events')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/event')
export class EventController {
  constructor(
    private eventService: EventService,
  ) {
  }

  @Get('all')
  @ApiOkResponse({ type: EventPagination })
  getEvents(@Request() request, @Query() query: PaginationDto): Promise<EventPagination> {
    return this.eventService.getEventsByUserId(request.user.id, query.skip || 0, query.take || defaultTakeCount);
  }

  @Post('read/all')
  @ApiOkResponse({ type: SuccessResponse })
  readAllEvents(@Request() request): Promise<SuccessResponse> {
    return this.eventService.readAll(request.user.id);
  }

  @Post(':id/read')
  @ApiImplicitParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  readEvent(@Param('id') id: string): Promise<SuccessResponse> {
    return this.eventService.readEvent(id);
  }
}
