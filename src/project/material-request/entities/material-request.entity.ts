import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../../common/core/soft-delete';
import { ProjectAccessoryType } from '../../enums';
import { MaterialRequestDto } from '../dtos/material-request.dto';
import { Project } from '../../entities/project.entity';

@Entity('material_request')
export class MaterialRequest extends SoftDelete {

  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @Column({ type: 'text', array: true })
  notes: string[];

  @ManyToOne(() => Project, project => project.materialRequests)
  project: Project;

  toDto(): MaterialRequestDto {
    return {
      id: this.id,
      type: this.type,
      notes: this.notes,
    };
  }
}
