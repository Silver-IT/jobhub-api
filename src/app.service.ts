import { Injectable } from '@nestjs/common';
import { Cron, NestSchedule } from 'nest-schedule';

import { ChatService } from './chat/chat.service';
import { EmailService } from './email/email.service';
import { ProjectService } from './project/project.service';
import { UsersService } from './users/users.service';
import { EstimateService } from './project/estimate/estimate.service';

@Injectable()
export class AppService extends NestSchedule {

  constructor(
    private readonly chatService: ChatService,
    private readonly emailService: EmailService,
    private readonly projectService: ProjectService,
    private readonly userService: UsersService,
    private readonly estimateService: EstimateService,
  ) {
    super();
  }

  @Cron('*/1 * * * *')
  async cronJob() {
    // pending messages
    const pendingMessages = await this.chatService.getUnreadPendingMessages();
    if (pendingMessages && pendingMessages.length) {
      for (let i = 0; i < pendingMessages.length; i++) {
        try {
          await this.emailService.sendUnreadMessagesEmail(pendingMessages[i]);
          await this.chatService.markPendingMessagesByIds(pendingMessages[i].messageIds);
        } catch (e) {
          console.log('Failed to send pending messages...', pendingMessages[i]);
        }
      }
    }

    // pending estimates (for super admins)
    const estimatePendingProjects = await this.projectService.getEstimatePendingProjects();
    const estimateReminderPendingProjects = estimatePendingProjects.filter(project => {
      const nextDay = new Date(project.createdAt);
      nextDay.setDate(nextDay.getDate() + 1);
      return !project.estimateReminderSent && nextDay > new Date();
    });
    const admins = await this.userService.findSuperAdmins();
    for (let i = 0; i < estimateReminderPendingProjects.length; i++) {
      try {
        await Promise.all(admins.map(r => this.emailService.sendEstimateReminderEmail(r, estimateReminderPendingProjects[i])));
        await this.projectService.setEstimateReminderEmailSent(estimateReminderPendingProjects[i]);
      } catch (e) {
        console.log('failed to send estimate pending messages...', estimateReminderPendingProjects[i]);
      }
    }

    // pending site visits (for customers)
    const siteVisitPendingSchedules = await this.estimateService.getSiteVisitPendingSchedules();
    for (let i = 0; i < siteVisitPendingSchedules.length; i++) {
      const schedule = siteVisitPendingSchedules[i];
      try {
        const recipients = admins.find(a => a.id === schedule.estimate.project.contractor.user.id) ? admins : [...admins, schedule.estimate.project.contractor.user];
        await Promise.all(recipients.map(r => this.emailService.sendSiteVisitReminderForCustomerEmail(r, schedule)));
        await this.estimateService.markSiteVisitScheduleReminderSent(schedule);
      } catch (e) {
        console.log('failed to send pending site visit email');
      }
    }
  }
}
