import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { Job } from './job.entity';

@Entity('applicant')
export class Applicant extends SoftDelete {

  @ManyToOne(() => Job, job => job.applicants)
  job: Job;

  @ApiProperty()
  @Column()
  fullName: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  phone: string;

  @ApiProperty()
  @Column({default: null})
  cv: string;
}
