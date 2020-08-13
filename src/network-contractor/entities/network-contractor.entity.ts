import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { NetworkContractorCategory } from './network-contractor-category.entity';
import { NetworkContractorDto } from '../dtos/network-contractor.dto';

@Entity('network_contractor')
export class NetworkContractor extends SoftDelete {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  companyName: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty()
  @Column()
  contacts: string;

  @ApiProperty()
  @Column()
  website: string;

  @ApiProperty()
  @Column()
  serviceDescription: string;

  @ApiProperty({ type: () => NetworkContractorCategory })
  @ManyToOne(() => NetworkContractorCategory, category => category.contractors)
  category: NetworkContractorCategory;

  @ApiProperty()
  @Column()
  logoUrl: string;

  toDto(): NetworkContractorDto {
    return {
      id: this.id,
      companyName: this.companyName,
      address: this.address,
      contacts: this.contacts,
      website: this.website,
      serviceDescription: this.website,
      category: this.category.id,
      logoUrl: this.logoUrl,
    };
  }
}
