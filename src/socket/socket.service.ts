import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { Event } from '../event/entities/event.entity';
import { Message } from '../chat/entities/message.entity';
import { LogRocketRecording } from '../log-rocket/entities/log-rocket-recording.entity';

@Injectable()
export class SocketService {

  event$: Subject<Event> = new Subject<Event>();

  message$: Subject<Message> = new Subject<Message>();

  logRocketRecording$: Subject<LogRocketRecording> = new Subject<LogRocketRecording>();

}
