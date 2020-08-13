import { ApiProperty } from '@nestjs/swagger';

import { MaterialType } from '../../idea-board/enums';

export class PortfolioDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ type: 'enum', isArray: true, enum: () => MaterialType })
  materials: MaterialType[];

  @ApiProperty()
  address: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  comment: string;
}
