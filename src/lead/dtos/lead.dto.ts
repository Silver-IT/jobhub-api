import { ApiProperty } from '@nestjs/swagger';

import { SourceFoundUs } from '../../common/enums/source-found-us.enum';
import { LeadStatus, LeadType } from '../enums';
import { PatioPackage } from '../../users/entities/patio-package.entity';

export class LeadDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: LeadType })
  type: LeadType;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  status: LeadStatus;

  @ApiProperty({ enum: SourceFoundUs })
  sourceFoundUs: SourceFoundUs;

  @ApiProperty({ required: false, type: () => PatioPackage })
  patioPackage?: PatioPackage;

  @ApiProperty()
  createdAt: string;

  @ApiProperty({ required: false })
  message?: string;
}
