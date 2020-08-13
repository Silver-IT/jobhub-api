export enum EmailType {
// general emails
  ConfirmRegister = 'CONFIRM_REGISTER',
  MessageReceived = 'MESSAGE_RECEIVED',
  PasswordReset = 'RESET_PASSWORD',
  Invitation = 'INVITATION',

// customer emails
  ProjectCreated = 'PROJECT_CREATED',
  EstimateReady = 'ESTIMATE_READY',
  EstimateUpdated = 'ESTIMATE_UPDATED',
  SiteVisitScheduled = 'SITE_VISIT_SCHEDULED',
  SiteVisitReminderForCustomer = 'SITE_VISIT_REMINDER_FOR_CUSTOMER',
  SiteVisitScheduleChanged = 'SITE_VISIT_SCHEDULE_CHANGED',
  ReceivedFinalProposal = 'RECEIVED_FINAL_PROPOSAL',
  FinalProposalUpdated = 'FINAL_PROPOSAL_UPDATED',
  FinalProposalAccepted = 'FINAL_PROPOSAL_ACCEPTED',
  MilestonePaymentRequested = 'MILESTONE_PAYMENT_REQUESTED',
  ReceivedMilestonePayment = 'RECEIVED_MILESTONE_PAYMENT',
  PickPaversScheduled = 'PICK_PAVERS_SCHEDULED',
  PickPaversScheduleChanged = 'PICK_PAVERS_SCHEDULE_CHANGED',
  FinalMilestonePaymentRequested = 'FINAL_MILESTONE_PAYMENT_REQUESTED',
  FinalMilestoneModified = 'FINAL_MILESTONE_MODIFIED',
  TestimonialRequest = 'TESTIMONIAL_REQUEST',
  DepositMilestoneUpdated = 'DEPOSIT_MILESTONE_UPDATED',
  ReceivedFinalMilestoneWithHold = 'RECEIVED_FINAL_MILESTONE_WITH_HOLD',

// contractor emails
  NewProjectRegistered = 'NEW_PROJECT_REGISTERED',
  EstimateReminder = 'ESTIMATE_REMINDER',
  EstimateAccepted = 'ESTIMATE_ACCEPTED',
  SiteVisitReminderForContractor = 'SITE_VISIT_REMINDER_FOR_CONTRACTOR', // TODO: add email template
  FinalProposalReminder = 'SUBMIT_PROPOSAL_REMINDER', // TODO: add email template
  DepositMade = 'DEPOSIT_MADE',
  MilestonePaid = 'MILESTONE_PAID',
  ContractReady = 'CONTRACT_READY',
  ContractSigned = 'CONTRACT_SIGNED',
  SiteVisitScheduleChangeRequest = 'SITE_VISIT_SCHEDULE_CHANGE_REQUEST',
  PickPaversScheduleChangeRequest = 'PICK_PAVERS_SCHEDULE_CHANGE_REQUEST',
  EstimateDeclined = 'ESTIMATE_DECLINED',
  FinalProposalDeclined = 'FINAL_PROPOSAL_DECLINED',

  ChangeEmail = 'CHANGE_EMAIL',
}
