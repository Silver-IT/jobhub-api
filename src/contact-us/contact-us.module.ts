import { Module } from '@nestjs/common';

import { SlackModule } from '../slack/slack.module';
import { LeadModule } from '../lead/lead.module';

import { ContactUsController } from './contact-us.controller';

@Module({
  imports: [
    SlackModule,
    LeadModule,
  ],
  controllers: [
    ContactUsController
  ],
})
export class ContactUsModule {
}
