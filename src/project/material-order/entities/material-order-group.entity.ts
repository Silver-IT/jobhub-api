import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { MaterialOrderItem } from './material-order-item.entity';
import { Project } from '../../entities/project.entity';
import { SoftDelete } from '../../../common/core/soft-delete';
import { ProjectAccessoryType } from '../../enums';
import { MaterialOrderGroupType } from '../enums';
import { MaterialOrderGroupDto } from '../dtos/material-order-group.dto';

@Entity('material_order_group')
export class MaterialOrderGroup extends SoftDelete {

  @ManyToOne(() => Project, project => project.materialOrderGroups)
  project: Project;

  @OneToMany(() => MaterialOrderItem, item => item.group)
  items: MaterialOrderItem[];

  @Column({ type: 'enum', enum: ProjectAccessoryType, nullable: true, default: undefined })
  layoutType: ProjectAccessoryType;

  @Column({ type: 'enum', enum: MaterialOrderGroupType })
  groupType: MaterialOrderGroupType;

  toDto(): MaterialOrderGroupDto {
    return {
      id: this.id,
      items: this.items.map(item => item.toDto()),
      layoutType: this.layoutType,
      groupType: this.groupType,
    };
  }
}
