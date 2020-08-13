import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';
import { Project } from '../project/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ChatDto } from './dtos/chat.dto';
import { MessageDto } from './dtos/message.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { UserRole } from '../common/enums/user-role.enum';
import { MessageFrom } from './enums';
import { SocketService } from '../socket/socket.service';
import { SuccessResponse } from '../common/models/success-response';
import { TotalUnreadDto } from './dtos/total-unread.dto';
import { groupByArray } from '../common/utils/array.util';
import { PendingMessage } from './interfaces';

@Injectable()
export class ChatService {

  constructor(
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
    private readonly socketService: SocketService
  ) {
  }

  findChatById(id: string): Promise<Chat> {
    return this.chatRepository.findOne({
      relations: [ 'project', 'project.customer', 'project.customer.user', 'project.contractor', 'project.contractor.user' ],
      where: { id }
    });
  }

  async readMessageByIdAndUserId(id: string, user: User): Promise<SuccessResponse> {
    const userId = user.id;
    const message = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer_user')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor_user')
      .where('message.id = :id', { id })
      .andWhere('(contractor_user.id = :userId or customer_user.id = :userId)', { userId })
      .andWhere('message.readAt is null')
      .getOne();
    if (message) {
      if (user.role === UserRole.Customer) {
        if (message.from !== MessageFrom.FromCustomer) {
          message.readAt = new Date().toISOString();
          await this.messageRepository.save(message);
          return new SuccessResponse(true);
        } else {
          return new SuccessResponse(false);
        }
      } else {
        if (message.from === MessageFrom.FromCustomer) {
          message.readAt = new Date().toISOString();
          await this.messageRepository.save(message);
          return new SuccessResponse(true);
        } else {
          return new SuccessResponse(false);
        }
      }
    } else {
      return new SuccessResponse(false);
    }
  }

  async readMessagesUntilDateByUserAndChatId(date: Date, user: User, chatId: string) {
    const userId = user.id;
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer_user')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor_user')
      .where('(contractor_user.id = :userId or customer_user.id = :userId)', { userId })
      .andWhere('chat.id = :chatId', { chatId })
      .andWhere('message.createdAt <= :date', { date })
      .andWhere('message.readAt is null')
      .getMany();
    const arrived = this.filterArrivedMessages(messages, user);
    arrived.forEach(x => x.readAt = new Date().toISOString());
    await this.messageRepository.save(arrived);
    return new SuccessResponse(true);
  }

  async findChatsByUserId(user: User): Promise<ChatDto[]> {
    const userId = user.id;
    const chats = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('project.customer', 'project_customer')
      .leftJoinAndSelect('project_customer.user', 'project_customer_user')
      .leftJoinAndSelect('project.contractor', 'project_contractor')
      .leftJoinAndSelect('project_contractor.user', 'project_contractor_user')
      .where('project_customer_user.id = :userId', { userId })
      .orWhere('project_contractor_user.id = :userId', { userId })
      .getMany();

    const withMessages = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.messages', 'messages')
      .where(user.role === UserRole.Customer ? 'messages.from = \'FROM_CONTRACTOR\'' : 'messages.from = \'FROM_CUSTOMER\'')
      .andWhere('messages.readAt is null')
      .getMany();
    chats.forEach(chat => {
      const found = withMessages.find(x => x.id === chat.id);
      chat.unread = found ? found.messages.length : 0;
    });
    chats.sort((chat1, chat2) => chat1.unread < chat2.unread ? 1 : -1);
    return chats.map(chat => chat.toDto());
  }

  async initChat(project: Project): Promise<ChatDto> {
    const chat = await this.chatRepository.createQueryBuilder('chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('project.customer', 'project_customer')
      .leftJoinAndSelect('project_customer.user', 'project_customer_user')
      .leftJoinAndSelect('project.contractor', 'project_contractor')
      .leftJoinAndSelect('project_contractor.user', 'project_contractor_user')
      .where('project.id = :id', { id: project.id })
      .getOne();
    if (chat) {
      return chat.toDto();
    } else {
      const newChat = new Chat();
      newChat.project = project;
      const res = await this.chatRepository.save(newChat);
      return res.toDto();
    }
  }

  async sendMessage(payload: SendMessageDto, chat: Chat, user: User): Promise<MessageDto> {
    const message = new Message();
    message.text = payload.message;
    message.attachments = payload.attachments;
    message.from = user.role === UserRole.Customer ? MessageFrom.FromCustomer : MessageFrom.FromContractor;
    message.chat = chat;
    const res = await this.messageRepository.save(message);
    this.socketService.message$.next(res);
    return res.toDto();
  }

  async getMessages(chat: Chat, skip: number, take: number): Promise<MessageDto[]> {
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :id', { id: chat.id })
      .orderBy('message.createdAt', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();
    return messages.map(message => message.toDto());
  }

  async getTotalUnreadCount(user: User): Promise<TotalUnreadDto> {
    const userId = user.id;
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer_user')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor_user')
      .where('(contractor_user.id = :userId or customer_user.id = :userId)', { userId })
      .andWhere('message.readAt is null')
      .getMany();
    const arrived = this.filterArrivedMessages(messages, user);
    return {
      total: arrived.length
    };
  }

  async getUnreadPendingMessages(): Promise<PendingMessage[]> {
    const messages = await this.messageRepository.createQueryBuilder('message')
      .leftJoinAndSelect('message.chat', 'chat')
      .leftJoinAndSelect('chat.project', 'project')
      .leftJoinAndSelect('project.customer', 'customer')
      .leftJoinAndSelect('customer.user', 'customer_user')
      .leftJoinAndSelect('project.contractor', 'contractor')
      .leftJoinAndSelect('contractor.user', 'contractor_user')
      .where('message.readAt is null')
      .andWhere('message.mailed is false')
      .select(['chat.id', 'message.id', 'message.text', 'message.createdAt', 'message.from',
        'customer_user.email', 'contractor_user.email', 'project.name', 'customer_user.firstName', 'customer_user.lastName', 'contractor_user.firstName', 'contractor_user.lastName'])
      .groupBy('chat.id')
      .addGroupBy('message.id')
      .addGroupBy('customer_user.email')
      .addGroupBy('customer_user.firstName')
      .addGroupBy('customer_user.lastName')
      .addGroupBy('contractor_user.email')
      .addGroupBy('contractor_user.firstName')
      .addGroupBy('contractor_user.lastName')
      .addGroupBy('project.name')
      .orderBy('message.createdAt', 'ASC')
      .getRawMany();
    const chatGroup = groupByArray(messages, 'chat_id');
    const pendingMessages: PendingMessage[] = [];
    Object.keys(chatGroup).map(chatId => {
      chatGroup[chatId] = groupByArray(chatGroup[chatId], 'message_from');
      const fromCustomer = chatGroup[chatId][MessageFrom.FromCustomer];
      const fromContractor = chatGroup[chatId][MessageFrom.FromContractor];
      if (fromCustomer) {
        pendingMessages.push({ ...ChatService.groupMessages(fromCustomer, MessageFrom.FromCustomer), chatId });
      }
      if (fromContractor) {
        pendingMessages.push({ ...ChatService.groupMessages(fromContractor, MessageFrom.FromContractor), chatId });
      }
    });
    return pendingMessages;
  }

  async markPendingMessagesByIds(ids: string[]): Promise<any> {
    const messages = await this.messageRepository.findByIds(ids);
    messages.forEach(x => x.mailed = true);
    await this.messageRepository.save(messages);
  }

  private filterArrivedMessages(messages: Message[], user: User) {
    return messages.filter(x => {
      if (user.role === UserRole.Customer) {
        return x.from === MessageFrom.FromContractor
      } else if (user.role === UserRole.Contractor || user.role === UserRole.SuperAdmin) {
        return x.from === MessageFrom.FromCustomer;
      } else {
        return false;
      }
    });
  }

  private static groupMessages(messages: Array<any>, from: MessageFrom): PendingMessage {
    const message = messages.reduce((msg, item) => {
      msg += item.message_text + '<br>';
      return msg;
    }, '');
    const createdAt = messages[messages.length - 1].message_createdAt;
    const email = from === MessageFrom.FromContractor ? messages[0].customer_user_email : messages[0].contractor_user_email;
    const recipientName = MessageFrom.FromCustomer ? `${messages[0].contractor_user_firstName} ${messages[0].contractor_user_lastName}` : `${messages[0].customer_user_firstName} ${messages[0].customer_user_lastName}`;
    const senderName = MessageFrom.FromCustomer ? `${messages[0].customer_user_firstName} ${messages[0].customer_user_lastName}` : `${messages[0].contractor_user_firstName} ${messages[0].contractor_user_lastName}`;
    return {
      message,
      createdAt,
      email,
      project: messages[0].project_name,
      messageIds: messages.map(x => x.message_id),
      recipientName,
      senderName,
    };
  }
}
