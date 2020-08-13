import { EmailEventDto } from './email-event.dto';
import { EmailEventType } from '../enums';

export class SendGridEmailEventDto {
  event_name: string;
  processed: Date;
  reason: string;
  mx_server: string;
  url: string;

  toEmailEvent(): EmailEventDto {
    return {
      type: EmailEventType[this.event_name],
      processedAt: this.processed,
      mailServer: this.mx_server,
      reason: this.reason,
    };
  }
}
