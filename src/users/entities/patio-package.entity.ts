import { Column, Entity, OneToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { User } from './user.entity';
import { PackageType, PatioPackageAddition } from '../enums';

@Entity('patio_package')
export class PatioPackage extends SoftDelete {
  @Column({ type: 'enum', enum: PackageType })
  packageType: PackageType;

  @Column({ type: 'enum', enum: PatioPackageAddition, array: true, default: [] })
  additional: PatioPackageAddition[];

  @Column({ nullable: true, default: undefined })
  option: string;

  @OneToOne(() => User, user => user.patioPackage)
  user: User;

}
