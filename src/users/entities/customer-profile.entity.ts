import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

import { User } from './user.entity';
import { Project } from '../../project/entities/project.entity';
import { CustomerDto } from '../dtos/customer.dto';
import { SoftDelete } from '../../common/core/soft-delete';
import { SourceFoundUs } from '../../common/enums/source-found-us.enum';

@Entity('customer_profile')
export class CustomerProfile extends SoftDelete {
  @OneToOne(() => User, user => user.customerProfile)
  user: User;

  @OneToMany(() => Project, project => project.customer)
  projects: Project[];

  @Column({ type: 'enum', enum: SourceFoundUs, nullable: true, default: undefined })
  sourceFoundUs: SourceFoundUs;

  toDto(): CustomerDto {
    this.projects = this.projects.filter(project => !Boolean(project.deletedAt));
    this.user.ideas = this.user.ideas.filter(idea => !Boolean(idea.deletedAt));
    return { ...this.user.toUserDto(), projectCount: this.projects.length, ideaCount: this.user.ideas.length };
  }
}
