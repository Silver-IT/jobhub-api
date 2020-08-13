import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { NetworkContractor } from './network-contractor.entity';
import { SoftDelete } from '../../common/core/soft-delete';

@Entity('network_contractor_category')
export class NetworkContractorCategory extends SoftDelete {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean' })
  published: boolean;

  @OneToMany(() => NetworkContractor, contractor => contractor.category)
  contractors: NetworkContractor[];
}
