import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { SuccessResponse } from '../common/models/success-response';
import { getFromDto } from '../common/utils/repository.util';
import { SlackMessageType } from '../slack/enums/slack-message-type.enum';
import { SlackService } from '../slack/slack.service';
import { LeadService } from '../lead/lead.service';
import { Lead } from '../lead/entities/lead.entity';
import { LeadType } from '../lead/enums';
import { SendContactUsMessageDto } from './dtos/send-contact-us-message.dto';

@ApiTags('Others')
@Controller('api')
export class ContactUsController {
  constructor(
    private readonly leadService: LeadService,
    private readonly slackService: SlackService,
  ) {
  }

  @Post('contact')
  @ApiOkResponse({ type: SuccessResponse })
  async contact(@Body() body: SendContactUsMessageDto): Promise<SuccessResponse> {
    const lead = getFromDto<Lead>(body, new Lead())
    lead.type = LeadType.ContactUs;
    const data = await this.leadService.add(lead);
    try {
      await this.slackService.sendNotification(SlackMessageType.SendContactUsMessage, data);
    } catch (e) {
      console.log('contact us message error: ' + e);
    }
    return new SuccessResponse(true);
  }

}
