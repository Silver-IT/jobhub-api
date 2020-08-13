import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { MaterialOrderService } from './material-order.service';
import { ProjectService } from '../project.service';
import { TagService } from '../../tag/tag.service';
import { FinalProposalService } from '../final-proposal/final-proposal.service';
import { MaterialOrderGroupDto } from './dtos/material-order-group.dto';
import { MaterialOrderGroupType } from './enums';
import { TagCategory } from '../../tag/enums/tag.enum';

@ApiTags('Choose / Order Materials')
@Controller('api')
export class MaterialOrderController {
  constructor(
    private materialOrderService: MaterialOrderService,
    private finalProposalService: FinalProposalService,
    private projectService: ProjectService,
    private tagService: TagService,
  ) {
  }

  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => MaterialOrderGroupDto, isArray: true })
  @Post(':projectId/material-order')
  async saveMaterialOrder(@Param('projectId') projectId: string, @Body() body: MaterialOrderGroupDto[]): Promise<MaterialOrderGroupDto[]> {
    const project = await this.projectService.findProjectById(projectId);

    let materialOrderGroups = await this.materialOrderService.findOrderGroupsByProjectId(projectId);
    if (materialOrderGroups.length !== 0) {
      if (body.find(r => !Boolean(r.id))) {
        throw new BadRequestException('It is not allowed to add new material order group.');
      }
      if (body.length !== materialOrderGroups.length) {
        throw new BadRequestException('Material order group length does not match with saved groups.');
      }
    }
    const materialItems = body.reduce((items, group) => [...items, ...group.items], []);
    const materialNames = new Set<string>(materialItems.reduce((items, item) => [...items, item.name], []));
    const materialAmounts = new Set<string>(materialItems.reduce((items, item) => [...items, item.amount], []));
    const materialStyles = new Set<string>(materialItems.reduce((items, item) => [...items, item.style], []));
    const materialColors = new Set<string>(materialItems.reduce((items, item) => [...items, item.color], []));

    await this.tagService.bulkAdd(TagCategory.MaterialName, [...materialNames]);
    await this.tagService.bulkAdd(TagCategory.MaterialAmount, [...materialAmounts]);
    await this.tagService.bulkAdd(TagCategory.MaterialStyle, [...materialStyles]);
    await this.tagService.bulkAdd(TagCategory.PreferredColor, [...materialColors]);

    materialOrderGroups = await this.materialOrderService.save(project, body);
    return materialOrderGroups.map(group => group.toDto());
  }

  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: () => MaterialOrderGroupDto, isArray: true })
  @Get(':projectId/material-order')
  async materialOrderGroups(@Param('projectId') projectId: string): Promise<MaterialOrderGroupDto[]> {
    const orderGroups = await this.materialOrderService.findOrderGroupsByProjectId(projectId);
    if (!orderGroups || !orderGroups.length) {
      const proposal = await this.finalProposalService.findProposalFromProjectId(projectId);
      const accessoryOrderGroups = proposal.layouts.map(layout => [{
        items: [],
        groupType: MaterialOrderGroupType.Layout,
        layoutType: layout.type,
      }, {
        items: [],
        groupType: MaterialOrderGroupType.LayoutAccessory,
        layoutType: layout.type,
      }]);
      return [
        {
          items: [],
          groupType: MaterialOrderGroupType.Bulk,
        },
        ...accessoryOrderGroups.reduce((merged, m) => merged.concat(m)),
        {
          items: [],
          groupType: MaterialOrderGroupType.Other,
        },
      ];
    }
    return orderGroups.map(group => group.toDto());
  }
}
