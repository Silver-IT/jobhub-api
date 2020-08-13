import { Column, Entity, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { EventType } from '../enums/event.enum';
import { User } from '../../users/entities/user.entity';

@Entity('event')
export class Event extends SoftDelete {
  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, user => user.events)
  user: User;

  @ApiProperty({ enum: EventType })
  @Column({ enum: EventType })
  type: EventType;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty({required: false})
  @Column({default: null})
  readAt?: string;

  @ApiProperty({required: false})
  @Column({default: null})
  image?: string;

  @ApiProperty({required: false})
  @Column({type: 'json', default: null})
  meta?: any;
}
