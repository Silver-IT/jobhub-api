import { BadRequestException, Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import * as multiparty from 'multiparty';
import { fromString } from 'html-to-text';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ChatService } from './chat.service';
import { ProjectService } from '../project/project.service';
import { ChatDto } from './dtos/chat.dto';
import { SendMessageDto } from './dtos/send-message.dto';
import { MessageDto } from './dtos/message.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Chat } from './entities/chat.entity';
import { User } from '../users/entities/user.entity';
import { messageDefaultTakeCount } from '../common/constants/general.constants';
import { SuccessResponse } from '../common/models/success-response';
import { TotalUnreadDto } from './dtos/total-unread.dto';
import { extractEmailFromString } from '../common/utils/string.util';

@ApiTags('Chat')
@Controller('api/chat')
export class ChatController {

  static validateChatRequest(chat: Chat, user: User) {
    if (!chat) {
      throw new BadRequestException('Invalid chat id');
    }
    if (chat.project.customer.user.id !== user.id && chat.project.contractor.user.id !== user.id) {
      throw new BadRequestException('You are not participant to this conversation.');
    }
  }

  constructor(
    private readonly chatService: ChatService,
    private readonly projectService: ProjectService
  ) {
  }

  @Get()
  getSomething() {
    return this.chatService.getUnreadPendingMessages();
  }

  @Post('init/:projectId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'projectId', required: true })
  @ApiOkResponse({ type: ChatDto })
  async initChat(@Request() req, @Param('projectId') projectId: string): Promise<ChatDto> {
    const project = await this.projectService.findProjectById(projectId, req.user);
    if (!project) {
      throw new BadRequestException('Invalid project id');
    }
    if (!project.assignedContractor) {
      throw new BadRequestException('No contractor assigned to this project yet');
    }
    return this.chatService.initChat(project);
  }

  @Get('all')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: ChatDto, isArray: true })
  async getChats(@Request() req): Promise<ChatDto[]> {
    return this.chatService.findChatsByUserId(req.user);
  }

  @Post('email-reply')
  async replyFromEmail(@Request() req: any) {
    const form = new multiparty.Form();
    const res = await new Promise((resolve, reject) => {
      form.parse(req, (error, fields) => {
        if (error) {
          reject(error);
        }
        if (fields) {
          resolve(fields);
        }
      });
    });
    const domain = `@chat-reply.${process.env.MAIL_DOMAIN}`;
    const from = extractEmailFromString(res['from'][0]);
    const to = extractEmailFromString(res['to'][0]);
    const text = res['html'][0];
    const chatId = to.slice(0, to.length - domain.length);
    const chat = await this.chatService.findChatById(chatId);
    const payload: SendMessageDto = {
      message: fromString(text),
    }
    if (chat.project.customer.user.email === from) {
      await this.chatService.sendMessage(payload, chat, chat.project.customer.user);
      return new SuccessResponse(true);
    } else if (chat.project.contractor.user.email === from) {
      await this.chatService.sendMessage(payload, chat, chat.project.contractor.user);
      return new SuccessResponse(true);
    } else {
      return new SuccessResponse(false);
    }
  }

  @Get('unread')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: TotalUnreadDto })
  async getTotalUnreadCount(@Request() req): Promise<TotalUnreadDto> {
    return this.chatService.getTotalUnreadCount(req.user);
  }

  @Post('message/:messageId/read')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'messageId', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async readMessages(@Request() req, @Param('messageId') messageId: string): Promise<SuccessResponse> {
    return this.chatService.readMessageByIdAndUserId(messageId, req.user);
  }

  @Get(':chatId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiOkResponse({ type: ChatDto })
  async getChatById(@Request() req, @Param('chatId') chatId: string): Promise<ChatDto> {
    const chat = await this.chatService.findChatById(chatId);
    ChatController.validateChatRequest(chat, req.user);
    return chat.toDto();
  }

  @Post(':chatId/message')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiOkResponse({ type: MessageDto })
  async sendMessage(@Request() req, @Param('chatId') chatId: string, @Body() body: SendMessageDto): Promise<MessageDto> {
    const chat = await this.chatService.findChatById(chatId);
    ChatController.validateChatRequest(chat, req.user);
    return this.chatService.sendMessage(body, chat, req.user);
  }

  @Get(':chatId/messages')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiOkResponse({ type: MessageDto, isArray: true })
  async getMessages(@Request() req, @Query() query: PaginationDto, @Param('chatId') chatId: string): Promise<MessageDto[]> {
    const chat = await this.chatService.findChatById(chatId);
    ChatController.validateChatRequest(chat, req.user);
    return this.chatService.getMessages(chat, query.skip || 0, query.take || messageDefaultTakeCount);
  }

  @Post(':chatId/read/:until')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiImplicitParam({ name: 'chatId', required: true })
  @ApiImplicitParam({ name: 'until', required: true })
  @ApiOkResponse({ type: SuccessResponse })
  async readMessagesByDate(@Request() req, @Param('chatId') chatId: string, @Param('until') until: number): Promise<SuccessResponse> {
    return this.chatService.readMessagesUntilDateByUserAndChatId(new Date(until * 1000), req.user, chatId);
  }

}
