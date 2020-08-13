import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaterialOrderGroup } from './entities/material-order-group.entity';
import { MaterialOrderItem } from './entities/material-order-item.entity';
import { Project } from '../entities/project.entity';
import { MaterialOrderGroupDto } from './dtos/material-order-group.dto';
import { getFromDto } from '../../common/utils/repository.util';

@Injectable()
export class MaterialOrderService {
  constructor(
    @InjectRepository(MaterialOrderGroup) private materialOrderGroupRepository: Repository<MaterialOrderGroup>,
    @InjectRepository(MaterialOrderItem) private materialOrderItemRepository: Repository<MaterialOrderItem>,
  ) {
  }

  findOrderGroupsByProjectId(id: string): Promise<MaterialOrderGroup[]> {
    return this.materialOrderGroupRepository.createQueryBuilder('material_order_group')
      .leftJoinAndSelect('material_order_group.project', 'project')
      .leftJoinAndSelect('material_order_group.items', 'items')
      .where('project.id = :id', { id })
      .getMany();
  }

  async save(project: Project, body: MaterialOrderGroupDto[]): Promise<MaterialOrderGroup[]> {
    const materialOrderGroups = await Promise.all(body.map(async group => {
      const materialOrderItems = group.items.map(item => getFromDto(item, new MaterialOrderItem()));
      const materialOrderGroup = getFromDto<MaterialOrderGroup>(group, new MaterialOrderGroup());
      materialOrderGroup.groupType = group.groupType;
      materialOrderGroup.layoutType = group.layoutType;
      materialOrderGroup.items = await this.materialOrderItemRepository.save(materialOrderItems);
      materialOrderGroup.project = project;
      return materialOrderGroup;
    }));
    await this.materialOrderGroupRepository.save(materialOrderGroups);
    return this.findOrderGroupsByProjectId(project.id);
  }
}
