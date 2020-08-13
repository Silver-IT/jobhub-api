import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { TagCategory } from '../enums/tag.enum';

@Entity('tag')
export class Tag extends SoftDelete {

  @ApiProperty({ enum: TagCategory })
  @Column({ type: 'enum', enum: TagCategory })
  category: TagCategory;

  @ApiProperty()
  @Column()
  text: string;
}
