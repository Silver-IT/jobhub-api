import { SendGridEmailEventDto } from './send-grid-email-event.dto';

export class SendGridEmailStatusDto {
  from_email: string;
  msg_id: string;
  subject: string;
  to_email: string;
  status: string;
  template_id: string;
  asm_group_id: string;
  teammate: string;
  api_key_id: string;
  events: SendGridEmailEventDto[];
  outbound_ip: string;
  outbound_ip_type: string;
}
