import { EventType } from '../enums/event.enum';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { Estimate } from '../../project/estimate/entities/estimate.entity';
import { FinalProposal } from '../../project/final-proposal/entities/final-proposal.entity';
import { FinalProposalStatus } from '../../project/final-proposal/enums';
import { EstimateStatus } from '../../project/enums';
import { Milestone } from '../../project/entities/milestone.entity';

export class AddEvent {
  readonly type: EventType;
  readonly message: string;
  readonly user: User;

  constructor(type: EventType, user: User, message: string) {
    this.type = type;
    this.message = message;
    this.user = user;
  }
}

export class ProjectUpdatedEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.YourProjectHasUpdated, user, 'Project has been updated.');
    this.meta = project;
  }
}

export class EstimateUpdatedEvent extends AddEvent {
  meta: any;

  constructor(user: User, estimate: Estimate) {
    super(EventType.YouHaveNewEstimate, user, 'You have received an estimate.');
    this.meta = estimate;
  }
}

export class FinalProposalUpdateEvent extends AddEvent {
  meta: any;

  constructor(user: User, proposal: FinalProposal) {
    super(EventType.YouHaveNewProposal, user, 'You have received a final proposal.');
    this.meta = proposal;
  }
}

export class FinalProposalStatusChangedEvent extends AddEvent {
  meta: any;

  constructor(user: User, proposal: FinalProposal) {
    super(proposal.status === FinalProposalStatus.Declined ? EventType.FinalProposalHasBeenDeclined : EventType.FinalProposalHasBeenAccepted,
      user,
      proposal.status === FinalProposalStatus.Declined ? 'Your proposal has been declined.' : 'Your proposal has been accepted.');
    this.meta = proposal;
  }
}

export class EstimateStatusChangedEvent extends AddEvent {
  meta: any;

  constructor(user: User, estimate: Estimate) {
    super(estimate.status === EstimateStatus.Declined ? EventType.EstimateHasBeenDeclined : EventType.EstimateHasBeenAccepted,
      user,
      estimate.status === EstimateStatus.Declined ? 'Your estimate has been declined.' : 'Your estimate has been accepted.');
    this.meta = estimate;
  }
}

export class ProjectRegisteredEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.NewProjectHasBeenRegistered, user, 'New Project has been registered.');
    this.meta = project;
  }
}

export class UserRegisteredEvent extends AddEvent {
  meta: any;

  constructor(user: User, newUser: User) {
    super(EventType.UserRegisteredEvent, user, 'New user has been registered.');
    this.meta = newUser;
  }
}

export class CustomerReleasedMilestoneEvent extends AddEvent {
  meta: any;

  constructor(user: User, milestone: Milestone) {
    super(EventType.CustomerReleasedMilestoneEvent, user, 'Customer released a milestone.');
    this.meta = milestone;
  }
}

export class CustomerRequestedCashPaymentEvent extends AddEvent {
  meta: any;

  constructor(user: User, milestone: Milestone) {
    super(EventType.CustomerRequestedCashPaymentEvent, user, 'Customer requested to pay a milestone with cash.');
    this.meta = milestone;
  }
}

export class ContractorRequestedToReleaseMilestoneEvent extends AddEvent {
  meta: any;

  constructor(user: User, milestone: Milestone) {
    super(EventType.ContractorRequestedToReleaseMilestone, user, 'Contractor requested to release a milestone.');
    this.meta = milestone;
  }
}

export class ContractorConfirmedCashPaymentEvent extends AddEvent {
  meta: any;

  constructor(user: User, milestone: Milestone) {
    super(EventType.ContractorConfirmedCashPayment, user, 'Contractor has confirmed your cash payment.');
    this.meta = milestone;
  }
}

export class ContractorRequestedReviewEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.ContractorRequestedReviewEvent, user, 'Contractor has requested to review on a project.');
    this.meta = project;
  }
}

export class CustomerSignedContractEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.CustomerSignedContractEvent, user, 'Customer has signed contract on a project.');
    this.meta = project;
  }
}

export class ContractReadyEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.ContractReadyEvent, user, 'Contract is ready.');
    this.meta = project;
  }
}

export class CustomerAcceptedContractEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.CustomerAcceptedContractEvent, user, 'Customer has accepted contract.');
    this.meta = project;
  }
}

export class CustomerRescheduledSiteVisitEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.CustomerRescheduledSiteVisitEvent, user, 'Customer has rescheduled site visit.');
    this.meta = project;
  }
}

export class CustomerRequestedSiteVisitScheduleChangeEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.CustomerRequestedSiteVisitChangeEvent, user, 'Customer has requested to change the site visit day.');
    this.meta = project;
  }
}

export class CustomerRequestedPickOutPaversScheduleChangeEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.CustomerRequestedPickOutPaversChangeEvent, user, 'Customer has requested to change the picking out pavers schedule.');
    this.meta = project;
  }
}

export class CustomerCanceledSiteVisitEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.CustomerCanceledSiteVisitEvent, user, 'Customer has canceled site visit.');
    this.meta = project;
  }
}

export class SiteVisitScheduleUpdatedEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.SiteVisitScheduleUpdatedEvent, user, 'Site visit schedule has been updated.');
    this.meta = project;
  }
}

export class PickOutPaversScheduleUpdatedEvent extends AddEvent {
  meta: any;

  constructor(user: User, project: Project) {
    super(EventType.PickOutPaversScheduleUpdatedEvent, user, 'Picking out pavers schedule has been updated.');
    this.meta = project;
  }
}
