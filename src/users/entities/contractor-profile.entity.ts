import { Entity, OneToMany, OneToOne } from 'typeorm';

import { User } from './user.entity';
import { Project } from '../../project/entities/project.entity';
import { SoftDelete } from '../../common/core/soft-delete';

@Entity('contractor_profile')
export class ContractorProfile extends SoftDelete {
  @OneToOne(() => User, user => user.contractorProfile)
  user: User;

  @OneToMany(() => Project, project => project.contractor)
  projects: Project[];
}
