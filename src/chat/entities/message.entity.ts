import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { Chat } from './chat.entity';
import { MessageFrom } from '../enums';
import { MessageDto } from '../dtos/message.dto';

@Entity('message')
export class Message extends SoftDelete {

  @ManyToOne(() => Chat, chat => chat.messages)
  chat: Chat;

  @ApiProperty()
  @Column()
  text: string;

  @ApiProperty({enum: MessageFrom})
  @Column({type: 'enum', enum: MessageFrom})
  from: MessageFrom;

  @ApiProperty({type: String, isArray: true, required: false})
  @Column({type: 'simple-array', default: null})
  attachments?: string[];

  @ApiProperty({required: false})
  @Column({default: null})
  readAt?: string;

  @Column({default: false})
  mailed: boolean;

  toDto(): MessageDto {
    return {
      id: this.id,
      chatId: this.chat.id,
      text: this.text,
      from: this.from,
      attachments: this.attachments,
      readAt: this.readAt,
      createdAt: this.createdAt
    };
  }
}
