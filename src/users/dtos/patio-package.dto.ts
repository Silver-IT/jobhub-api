import { ApiProperty } from '@nestjs/swagger';

import { PackageType, PatioPackageAddition } from '../enums';
import { User } from '../entities/user.entity';

export class PatioPackageDto {
  @ApiProperty({ type: 'enum', enum: PackageType })
  packageType: PackageType;

  @ApiProperty({ type: 'enum', enum: PatioPackageAddition, isArray: true })
  additional: PatioPackageAddition[];

  @ApiProperty({ required: false })
  option: string;

  user?: User;
}
