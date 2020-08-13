import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

import { SocketService } from './socket.service';
import { Event } from '../event/entities/event.entity';
import { Message } from '../chat/entities/message.entity';
import { LogRocketRecording } from '../log-rocket/entities/log-rocket-recording.entity';

@WebSocketGateway()
export class SocketGateway {

  @WebSocketServer()
  server: Server;

  users: string[] = [];

  constructor(
    private socketService: SocketService,
  ) {
    this.socketService.event$.asObservable().subscribe(event => {
      this.sendEvent(event);
    });
    this.socketService.message$.asObservable().subscribe(message => {
      this.sendMessage(message);
    });
  }

  @SubscribeMessage('join')
  async join(@MessageBody() id: string) {
    this.users.push(id);
  }

  sendEvent(event: Event) {
    this.server.emit(`${event.user.id}_events`, event);
  }

  sendMessage(message: Message) {
    this.server.emit(`${message.chat.project.customer.user.id}_messages`, message.toDto());
    this.server.emit(`${message.chat.project.contractor.user.id}_messages`, message.toDto());
    // TODO: send event to admin always
  }

  sendLogRocketRecording(recording: LogRocketRecording) {
    this.server.emit(`log_rocket_recordings`, recording);
  }
}
