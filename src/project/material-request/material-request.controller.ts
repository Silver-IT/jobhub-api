import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { MaterialRequestService } from './material-request.service';
import { FinalProposalService } from '../final-proposal/final-proposal.service';
import { ProjectService } from '../project.service';
import { MaterialRequestDto } from './dtos/material-request.dto';

@ApiTags('Choose / Order Materials')
@Controller('api')
export class MaterialRequestController {

  constructor(
    private projectService: ProjectService,
    private materialRequestService: MaterialRequestService,
    private finalProposalService: FinalProposalService,
  ) {
  }

  @ApiBearerAuth()
  @Get(':projectId/material')
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => MaterialRequestDto, isArray: true })
  async materialRequests(@Param('projectId') projectId: string): Promise<MaterialRequestDto[]> {
    const materialRequests = await this.materialRequestService.findByProjectId(projectId);
    if (!materialRequests || !materialRequests.length) {
      const proposal = await this.finalProposalService.findProposalFromProjectId(projectId);
      return proposal.layouts.map(layout => ({
        type: layout.type,
        notes: [],
      }));
    }
    return materialRequests.map(m => m.toDto());
  }

  @ApiBearerAuth()
  @Post(':projectId/material')
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => MaterialRequestDto, isArray: true })
  @ApiBody({ type: () => MaterialRequestDto, required: true, isArray: true })
  async saveMaterialRequests(@Param('projectId') projectId: string, @Body() body: MaterialRequestDto[]): Promise<MaterialRequestDto[]> {
    const project = await this.projectService.findProjectById(projectId);
    let materialRequests = await this.materialRequestService.findByProjectId(projectId);
    if (materialRequests.length !== 0) {
      if (body.find(r => !Boolean(r.id))) {
        throw new BadRequestException('Invalid request');
      }
      if (body.length !== materialRequests.length) {
        throw new BadRequestException('Invalid request');
      }
    }
    materialRequests = await this.materialRequestService.save(project, body);
    return materialRequests.map(m => m.toDto());
  }
}
