import { Entity, OneToMany, OneToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { Project } from '../../project/entities/project.entity';
import { Message } from './message.entity';
import { User } from '../../users/entities/user.entity';
import { ChatDto } from '../dtos/chat.dto';

@Entity('chat')
export class Chat extends SoftDelete {

  @OneToOne(() => Project, project => project.chat)
  project: Project;

  @OneToMany(() => Message, message => message.chat)
  messages: Message[];

  @ApiProperty({type: User, required: false})
  contractor?: User;

  @ApiProperty({type: User, required: false})
  customer?: User;

  @ApiProperty({required: false})
  unread?: number;

  toDto(): ChatDto {
    return {
      id: this.id,
      project: {
        id: this.project.id,
        name: this.project.name,
        projectType: this.project.projectType
      },
      customer: this.project.customer.user.toUserDto(),
      contractor: this.project.contractor.user.toUserDto(),
      unread: this.unread
    }
  }
}
