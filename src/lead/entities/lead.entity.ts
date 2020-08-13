import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { SourceFoundUs } from '../../common/enums/source-found-us.enum';
import { PatioPackage } from '../../users/entities/patio-package.entity';
import { LeadDto } from '../dtos/lead.dto';
import { LeadStatus, LeadType } from '../enums';

@Entity('lead')
export class Lead extends SoftDelete {

  @Column({ type: 'enum', enum: LeadType, nullable: true, default: undefined })
  @ApiProperty({ enum: LeadType })
  type: LeadType;

  @Column()
  @ApiProperty()
  email: string;

  @Column()
  @ApiProperty()
  phone: string;

  @Column()
  @ApiProperty()
  fullName: string;

  @Column()
  @ApiProperty()
  message: string;

  @ApiProperty()
  @Column({ default: '' })
  address: string;

  @ApiProperty({ required: false })
  @Column('numeric', {
      precision: 20,
      scale: 15,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  latitude: number;

  @ApiProperty({ required: false })
  @Column('numeric', {
      precision: 20,
      scale: 15,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  longitude: number;

  @ApiProperty({ enum: LeadStatus })
  @Column({ type: 'enum', enum: LeadStatus, default: LeadStatus.Lead })
  status: LeadStatus;

  @ApiProperty({ enum: SourceFoundUs })
  @Column({ type: 'enum', enum: SourceFoundUs, nullable: true, default: undefined })
  sourceFoundUs: SourceFoundUs;

  @OneToOne(() => PatioPackage, patioPackage => patioPackage.user)
  @JoinColumn()
  patioPackage?: PatioPackage;

  toDto(): LeadDto {
    return {
      id: this.id,
      type: this.type,
      email: this.email,
      phone: this.phone,
      fullName: this.fullName,
      address: this.address,
      latitude: this.latitude,
      longitude: this.longitude,
      createdAt: this.createdAt,
      sourceFoundUs: this.sourceFoundUs,
      message: this.message,
      status: this.status,
      patioPackage: this.patioPackage,
    };
  }
}
