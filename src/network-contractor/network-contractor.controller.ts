import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiParam, ApiTags } from '@nestjs/swagger';

import { NetworkContractorService } from './network-contractor.service';
import { NetworkContractor } from './entities/network-contractor.entity';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { NetworkContractorDto } from './dtos/network-contractor.dto';
import { SuccessResponse } from '../common/models/success-response';
import {
  NetworkContractorCategoryDto,
  UpdateNetworkContractorCategoryDto,
} from './dtos/network-contractor-category.dto';
import { NetworkContractorCategory } from './entities/network-contractor-category.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { defaultTakeCount } from '../common/constants/general.constants';
import { PaginatorDto } from '../common/dtos/paginator.dto';

@ApiTags('Network Contractor')
@Controller('api/network-contractor')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class NetworkContractorController {
  constructor(
    private networkContractorService: NetworkContractorService,
  ) {
  }

  @Get('all')
  @ApiOkResponse({ type: () => PaginatorDto, isArray: true })
  async getAll(@Query() query: PaginationDto): Promise<PaginatorDto<NetworkContractorDto>> {
    const [data, count] = await this.networkContractorService.contractors(query.skip || 0, query.take || defaultTakeCount);
    return { data: data.map(contractor => contractor.toDto()), count };
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: NetworkContractor })
  getOne(@Param('id') id: string): Promise<NetworkContractor> {
    return this.networkContractorService.findContractorById(id);
  }

  @Post()
  @ApiOkResponse({ type: NetworkContractor })
  addOne(@Body() body: NetworkContractorDto): Promise<NetworkContractor> {
    return this.networkContractorService.addOne(body);
  }

  @Put(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: NetworkContractor })
  update(@Param('id') id: string, @Body() body: NetworkContractorDto): Promise<NetworkContractor> {
    return this.networkContractorService.update(id, body);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteOne(@Param('id') id: string): Promise<SuccessResponse> {
    return this.networkContractorService.deleteOne(id);
  }

  @Get('category/all')
  @ApiOkResponse({ type: PaginatorDto })
  async getCategories(@Query() query: PaginationDto): Promise<PaginatorDto<NetworkContractorCategory>> {
    const [data, count] = await this.networkContractorService.categories(query.skip || 0, query.take || defaultTakeCount);
    return { data, count };
  }

  @Get('category/:id')
  @ApiOkResponse({ type: NetworkContractorCategory })
  @ApiParam({ name: 'id', required: true })
  getCategory(@Param('id') id: string): Promise<NetworkContractorCategory> {
    return this.networkContractorService.findCategoryById(id);
  }

  @Put('category/:id')
  @ApiOkResponse({ type: NetworkContractorCategory })
  updateCategory(@Param('id') id: string, @Body() body: UpdateNetworkContractorCategoryDto): Promise<NetworkContractorCategory> {
    return this.networkContractorService.updateCategory(id, body);
  }

  @Delete('category/:id')
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  deleteCategory(@Param('id') id: string): Promise<SuccessResponse> {
    return this.networkContractorService.deleteCategory(id);
  }

  @Post('category')
  @ApiOkResponse({ type: NetworkContractorCategory })
  addCategory(@Body() body: NetworkContractorCategoryDto): Promise<NetworkContractorCategory> {
    return this.networkContractorService.addCategory(body);
  }
}
