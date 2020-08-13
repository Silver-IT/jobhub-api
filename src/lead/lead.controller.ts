import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { PaginatorDto } from '../common/dtos/paginator.dto';
import { defaultTakeCount } from '../common/constants/general.constants';
import { ArchivedType, SortByDateType } from '../common/enums/query.enum';
import { LeadDto } from './dtos/lead.dto';
import { QueryLeadsDto } from './dtos/query-leads.dto';
import { LeadService } from './lead.service';
import { SuccessResponse } from '../common/models/success-response';
import { LeadStatus } from './enums';

@ApiTags('Lead')
@ApiBearerAuth()
@Controller('api/lead')
export class LeadController {

  constructor(
    private readonly leadService: LeadService,
  ) {
  }

  @Get('all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: LeadDto, isArray: true })
  async leads(@Query() query: QueryLeadsDto): Promise<PaginatorDto<LeadDto>> {
    const [result, count] = await this.leadService.findAll(query.skip || 0,
      query.take || defaultTakeCount,
      query.sortByDate || SortByDateType.MostRecent,
      query.archivedType === ArchivedType.Archived ? LeadStatus.Archived : null);
    return { data: result.map(r => r.toDto()), count };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: LeadDto })
  async lead(@Param('id') id: string): Promise<LeadDto> {
    const lead = await this.leadService.findLeadById(id);
    return lead.toDto();
  }

  @Put(':id')
  @ApiOkResponse({ type: () => LeadDto })
  async updateLead(@Param('id') id: string, @Body() payload: LeadDto): Promise<LeadDto> {
    const updated = await this.leadService.updateLeadById(id, payload);
    return updated.toDto();
  }

  @Post(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOkResponse({ type: () => SuccessResponse })
  @ApiImplicitParam({ name: 'id', required: false })
  async archive(@Param('id') id: string): Promise<SuccessResponse> {
    await this.leadService.updateLeadStatusById(id, LeadStatus.Archived);
    return new SuccessResponse(true);
  }
}
