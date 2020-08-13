import { EmailType } from '../enums/email.type';
import * as Fs from 'fs';

export const EmailTemplateSubjects = {
  [EmailType.ProjectCreated]: 'Thanks for telling us about your project',
  [EmailType.EstimateReady]: 'Estimate ready',
  [EmailType.EstimateUpdated]: 'Estimate updated',
  [EmailType.SiteVisitScheduled]: 'Your upcoming site visit has been scheduled!',
  [EmailType.SiteVisitReminderForCustomer]: 'Just a Reminder for our site visit tomorrow!',
  [EmailType.ReceivedFinalProposal]: 'Here is your final proposal!',
  [EmailType.FinalProposalUpdated]: 'There is an update on your final proposal!',
  [EmailType.FinalProposalAccepted]: 'Congratulations on hiring us for your hardscape project!',
  [EmailType.MilestonePaymentRequested]: 'Milestone 2 payment requested',
  [EmailType.ReceivedMilestonePayment]: 'Milestone 2 payment received',
  [EmailType.FinalMilestonePaymentRequested]: 'Final payment requested',
  [EmailType.FinalMilestoneModified]: 'Final payment request changed',
  [EmailType.ReceivedFinalMilestoneWithHold]: `Milestone 3 payment received`,
  [EmailType.TestimonialRequest]: 'Thank you for your business',
  [EmailType.ConfirmRegister]: 'Confirm your email address',
  [EmailType.NewProjectRegistered]: 'A New Project is ready for review',
  [EmailType.EstimateReminder]: `You've been requested to provide a virtual estimate on a new project`,
  [EmailType.EstimateAccepted]: `Site visit and finale proposal request`,
  [EmailType.SiteVisitReminderForContractor]: `Your site visit with {{customerName}} is tomorrow`,
  [EmailType.FinalProposalReminder]: `Submit your final proposal`,
  [EmailType.DepositMade]: `Your proposal has been accepted`,
  [EmailType.MilestonePaid]: `You've received a new milestone payment`,
  [EmailType.MessageReceived]: `Project consultation - {{projectName}}`,
  [EmailType.PasswordReset]: `Reset password`,
  [EmailType.Invitation]: `You are invited to join J & D Landscaping`,
  [EmailType.ContractSigned]: `{{customerName}} has signed a contract`,
  [EmailType.SiteVisitScheduleChangeRequest]: `{{customerName}} has requested another day for site visit`,
  [EmailType.ContractReady]: `Contract is ready`,
  [EmailType.SiteVisitScheduleChanged]: `Site visit schedule has been changed!`,
  [EmailType.PickPaversScheduleChanged]: `Picking out pavers schedule has been changed!`,
  [EmailType.PickPaversScheduleChangeRequest]: `{{customerName}} has requested another day for pick pavers`,
  [EmailType.PickPaversScheduled]: `Picking out pavers scheduled`,
  [EmailType.EstimateDeclined]: `{{customerName}} has declined the estimate`,
  [EmailType.FinalProposalDeclined]: `{{customerName}} has declined the final proposal`,
  [EmailType.ChangeEmail]: `Verify your new email address`,
  [EmailType.DepositMilestoneUpdated]: 'Deposit updated!',
};

export const EmailTemplateContents = {
  [EmailType.ProjectCreated]: 'Hi {{name}},<br>Thanks for telling us about your project! We look forward to our call on {{consultationDate}} and are excited to learn more about your project.<br>If you have any questions in the mean time, please contact us via live chat Monday through Saturday 8am to 5pm.',
  [EmailType.EstimateReady]: 'Hi {{name}},<br>Thanks for telling us about your project! Please click on the link below to view your virtual estimate and to setup a site visit. <a href="{{estimateLink}}">See Estimate</a>',
  [EmailType.SiteVisitScheduled]: 'Hi {{name}},<br>Thanks for scheduling your site visit with J & D Landscaping! Your site visit has been scheduled for {{siteVisitDate}}.<br><a href="{{rescheduleLink}}">Want to reschedule?</a>',
  [EmailType.SiteVisitReminderForCustomer]: 'Hi {{name}},<br>This email is to remind you that your site visit is scheduled for {{siteVisitDate}}.<br>If you have any questions or need to reschedule, please reach out to J & D Landscaping as soon as possible.<br><a href="{{rescheduleLink}}">Want to reschedule?</a>',
  [EmailType.ReceivedFinalProposal]: 'Hi {{name}},<br>J & D Landscaping  has submitted their final proposal for your project. Please review all the details and if you\'re satisfied, accept the proposal to hire J & D Landscaping.<br><a href="{{finalProposalLink}}">See Final Proposal</a>',
  [EmailType.FinalProposalUpdated]: 'Hi {{name}}.<br>J & D Landscaping has submitted an updated final proposal for your project. Please review all the details and if you\'re satisfied, accept the proposal to hire J & D Landscaping.<br><a href="{{finalProposalLink}}">See Final Proposal</a>',
  [EmailType.FinalProposalAccepted]: 'Hi {{name}},<br>You have already made your first deposit and should expect J & D Landscaping to reach out to you shortly. Your will be required to submit the next milestone payment when the J & D landscaping officially starts the project and requests payment.<br><a href="{{projectLink}}">Track your project</a>',
  [EmailType.MilestonePaymentRequested]: 'Hi {{name}},<br>Please <a href="{{loginLink}}">login</a> to your account or <a href="{{projectLink}}">click here</a> to make a payment. Your next and last milestone payment will be due at the completion of your project.',
  [EmailType.ReceivedMilestonePayment]: 'Hi {{name}},<br>Thank you, J & D Landscaping has received your payment for milestone 2.<a href="{{projectLink}}">Track your project</a>',
  [EmailType.FinalMilestonePaymentRequested]: 'Hi {{name}},<br>J & D Landscaping has requested payment on milestone 3 (project complete) payment.<br>Please <a href="{{loginLink}}">login</a> to your account or <a href="{{projectLink}}">click here</a> to make a payment.',
  [EmailType.FinalMilestoneModified]: 'Hi {{name}},<br>J & D Landscaping has requested a change order and payment on milestone 3 (project complete) payment.<br>Please <a href="{{loginLink}}">login</a> to your account or <a href="{{projectLink}}">click here</a> to confirm changes prior to payment.<br><a href="{{projectLink}}">Make payment</a>',
  [EmailType.TestimonialRequest]: 'Hi {{name}},<br>Thank you for Hiring J & D Landscaping to complete your outdoor project, it was a pleasure working with you.<br>We would love if you could help us continue to grow by leaving us a great google review about our company.<br><a href="{{reviewLink}}">Leave a review</a>',
  [EmailType.ConfirmRegister]: 'Hi {{name}},<br>To Finish creating your J & D Landscaping account, please confirm your email address by clicking in the following link.<br><a href="{{activateLink}}">Activate Account</a>',
  [EmailType.NewProjectRegistered]: 'Hi {{name}},<br>Great News, another new project is ready to review!<br>Please follow the link below to view the project details or view your calendar.<br><a href="{{projectLink}}">See Project</a>',
  [EmailType.EstimateReminder]: `Hi {{name}},<br>This is just a friendly reminder that your estimate with {{customerName}} is due in 24 hours.<br>Please login to your account to view contact details or to message {{customerName}}.<br>Please submit your estimate within 24 hours.<br><a href="{{estimateLink}}">Create Estimate</a>`,
  [EmailType.EstimateAccepted]: `Hi {{name}},<br>{{customerName}}, would like to schedule a site visit with J & D Landscaping on {{siteVisitDate}}.<br>Please login to your account to view contact details or to message {{customerName}}.<br>Please submit your final proposal within 48 hours from completion of site visit.<br><a href="{{confirmVisitLink}}">Confirm visit</a><br><a href="{{rescheduleLink}}">Want to reschedule?</a>`,
  [EmailType.SiteVisitReminderForContractor]: `Hi {{name}},<br>This is a friendly reminder that your site visit with {{customerName}} is scheduled for {{scheduleDate}}.<br>Please login to your account to view contact details or to message {{customerName}}.<br>Please submit your final proposal within 48 hours from completion of site visit.`,
  [EmailType.FinalProposalReminder]: `Hi {{name}},<br>{{customerName}} is waiting for your final proposal.<br>Please login and submit your proposal within the next 24 hours.<br><a href="{{proposalLink}}">Create Proposal</a>`,
  [EmailType.DepositMade]: `Hi {{name}},<br>{{customerName}}, has accepted your proposal and has paid their first milestone. Please reach out to {{customerName}} to coordinate an exact start date.<br>Remember, you an easily keep track of conversations and communication with customers directly from the message section of your account.<br><a href="{{sendMessageLink}}">SendMessage</a>`,
  [EmailType.MilestonePaid]: `Hi {{name}},<br>You've received a new milestone payment from {{customerName}}.<br>Click here to view the payment.<br><a href="{{paymentLink}}">Check payment</a>`,
  [EmailType.MessageReceived]: `Hi {{recipientName}},<br>You've received a new message from {{senderName}}.<br>"{{messageContent}}"<br><a href="{{loginLink}}">Click here</a> to view and reply to the message.<br>Replay directly to send message.<a href="{{replyLink}}">Reply message</a>`,
  [EmailType.PasswordReset]: `Hi {{name}},<br>You can create a new password by clicking this link: <a href="{{passwordResetLink}}">{{passwordResetLink}}</a><br>This link expires in {{linkExpireHours}} hour(s).`,
  [EmailType.Invitation]: `Hi {{name}},<br>You are invited to J & D Landscaping.<br>Your temporary password is '{{tempPassword}}'. Use this password to set a new password in this link: <a href="{{passwordResetLink}}">{{passwordResetLink}}</a><br>This link expires in {{linkExpireHours}} hour(s).`,
  [EmailType.ContractSigned]: `Hi {{name}},<br>{{customerName}} has requested a contract on his project.<br>Click here to make a contract.<br><a href="{{contractLink}}">Make contract</a>`,
  [EmailType.ContractReady]: `Hi {{name}},<br>You have received a contract.<br>You can review the contract by clicking this link.<br><a href="{{contractLink}}">Review Contract</a>`,
};

export function emailTemplate(code: EmailType): string {
  const filePath = `${__dirname}/../../../templates/${code}.html`;
  if (Fs.existsSync(filePath)) {
    const html = Fs.readFileSync(filePath);
    return html.toString();
  } else {
    const unsubscribe = '<br><br>Send from J & D Landscaping<br>' +
      'J & D Landscaping LLC, 123 South Main St., East Windsor, CT 06088<br>' +
      `<a href="${process.env.UNSUBSCRIBE_LINK}">Unsubscribe</a>`;
    return `${EmailTemplateContents[code]}${unsubscribe}`;
  }
}
