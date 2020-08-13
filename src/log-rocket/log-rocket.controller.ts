import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { LogRocketService } from './log-rocket.service';
import { SaveRecordingDto } from './dtos/save-recording.dto';
import { LogRocketRecording } from './entities/log-rocket-recording.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { SocketService } from '../socket/socket.service';
import { FilterRecordingDto } from './dtos/filter-recording.dto';

@ApiTags('LogRocket')
@Controller('api/log-rocket')
export class LogRocketController {

  constructor(
    private logRocketService: LogRocketService,
    private socketService: SocketService
  ) {
  }

  @Post()
  @ApiOkResponse({ type: LogRocketRecording })
  async saveRecording(@Body() body: SaveRecordingDto): Promise<LogRocketRecording> {
    const found = await this.logRocketService.findByRecordingId(body.recordingId);
    const recording = await this.logRocketService.saveRecording(body);
    this.socketService.logRocketRecording$.next(recording.toDto(Boolean(found)));
    return recording;
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: LogRocketRecording, isArray: true })
  async getRecordings(@Query() query: FilterRecordingDto): Promise<PaginatorDto<LogRocketRecording>> {
    const [data, count] = await this.logRocketService.find(query);
    return { data, count };
  }

  @Post('resolve/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: LogRocketRecording })
  markRecordAsResolved(@Param('id') id: string): Promise<LogRocketRecording> {
    return this.logRocketService.markRecordingAsResolved(id);
  }

  @Post('unresolve/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: LogRocketRecording })
  markRecordAsUnResolved(@Param('id') id: string): Promise<LogRocketRecording> {
    return this.logRocketService.markRecordingAsResolved(id, false);
  }
}
