import { HttpService, Injectable } from '@nestjs/common';

import { SlackMessageType } from './enums/slack-message-type.enum';
import { buildSlackMessage } from '../common/utils/slack.util';

@Injectable()
export class SlackService {
  constructor(
    private http: HttpService,
  ) {
  }

  sendNotification(type: SlackMessageType, data: any) {
    return this.http.post(process.env.CONTACT_US_SLACK_WEBHOOK_URL, buildSlackMessage(type, data)).toPromise();
  }
}
