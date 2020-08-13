import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { JobType, SalaryType } from '../enums/job.enum';
import { SoftDelete } from '../../common/core/soft-delete';
import { Applicant } from './applicant.entity';

@Entity('job')
export class Job extends SoftDelete {

  @OneToMany(() => Applicant, apply => apply.job)
  applicants: Applicant[];

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty({enum: JobType})
  @Column({type: 'enum', enum: JobType})
  type: JobType;

  @ApiProperty({type: Number})
  @Column({type: 'decimal'})
  salary: number;

  @ApiProperty({enum: SalaryType})
  @Column({type: 'enum', enum: SalaryType})
  salaryType: SalaryType;

  @ApiProperty({type: Boolean})
  @Column({type: 'boolean'})
  remote: boolean;

  @ApiProperty({type: String, isArray: true})
  @Column({type: 'simple-array', default: null})
  hardSkills: string[];

  @ApiProperty({type: String, isArray: true})
  @Column({type: 'simple-array', default: null})
  softSkills: string[];
}
