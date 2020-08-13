import { Injectable } from '@nestjs/common';

import { UsersService } from '../users/users.service';
import { ProjectService } from '../project/project.service';
import { EventService } from '../event/event.service';
import { SocketService } from '../socket/socket.service';
import { Project } from '../project/entities/project.entity';
import { Event } from '../event/entities/event.entity';
import {
  ContractorConfirmedCashPaymentEvent,
  ContractorRequestedReviewEvent,
  ContractorRequestedToReleaseMilestoneEvent,
  ContractReadyEvent,
  CustomerCanceledSiteVisitEvent,
  CustomerReleasedMilestoneEvent,
  CustomerRequestedCashPaymentEvent,
  CustomerSignedContractEvent,
  CustomerRequestedSiteVisitScheduleChangeEvent,
  CustomerRescheduledSiteVisitEvent,
  EstimateStatusChangedEvent,
  EstimateUpdatedEvent,
  FinalProposalStatusChangedEvent,
  FinalProposalUpdateEvent,
  ProjectRegisteredEvent,
  ProjectUpdatedEvent,
  UserRegisteredEvent,
  SiteVisitScheduleUpdatedEvent,
  PickOutPaversScheduleUpdatedEvent,
  CustomerRequestedPickOutPaversScheduleChangeEvent,
} from '../event/dtos/add-event.dto';
import { Estimate } from '../project/estimate/entities/estimate.entity';
import { User } from '../users/entities/user.entity';
import { FinalProposal } from '../project/final-proposal/entities/final-proposal.entity';
import { Milestone } from '../project/entities/milestone.entity';

@Injectable()
export class NotificationService {

  constructor(
    private userService: UsersService,
    private projectService: ProjectService,
    private eventService: EventService,
    private socketService: SocketService,
  ) {
  }

  async projectUpdatedEvent(project: Project): Promise<Event> {
    const payload = new ProjectUpdatedEvent(project.customer.user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async estimateUpdatedEvent(user: User, estimate: Estimate): Promise<Event> {
    const payload = new EstimateUpdatedEvent(user, estimate);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async finalProposalSetEvent(user: User, proposal: FinalProposal): Promise<Event> {
    const payload = new FinalProposalUpdateEvent(user, proposal);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async projectRegisteredEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new ProjectRegisteredEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async finalProposalStatusChangedEvent(users: User[], proposal: FinalProposal): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new FinalProposalStatusChangedEvent(user, proposal);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async estimateStatusChangedEvent(users: User[], estimate: Estimate): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new EstimateStatusChangedEvent(user, estimate);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async userRegisteredEvent(users: User[], newUser: User): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new UserRegisteredEvent(user, newUser);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerReleasedMilestoneEvent(users: User[], milestone: Milestone): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerReleasedMilestoneEvent(user, milestone);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRequestedCashPaymentEvent(users: User[], milestone: Milestone): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedCashPaymentEvent(user, milestone);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async contractorRequestedToReleaseMilestoneEvent(user: User, milestone: Milestone): Promise<Event> {
    const payload = new ContractorRequestedToReleaseMilestoneEvent(user, milestone);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async contractorConfirmedCashPaymentEvent(user: User, milestone: Milestone): Promise<Event> {
    const payload = new ContractorConfirmedCashPaymentEvent(user, milestone);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async contractorRequestedReviewEvent(user: User, project: Project): Promise<Event> {
    const payload = new ContractorRequestedReviewEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async customerSignedContractEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerSignedContractEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async contractReadyEvent(user: User, project: Project): Promise<Event> {
    const payload = new ContractReadyEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async customerAcceptedContractEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerSignedContractEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRescheduledSiteVisitEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRescheduledSiteVisitEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerCanceledSiteVisitEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerCanceledSiteVisitEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async siteVisitScheduleUpdatedEvent(user: User, project: Project): Promise<Event> {
    const payload = new SiteVisitScheduleUpdatedEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async pickOutPaversScheduleUpdatedEvent(user: User, project: Project): Promise<Event> {
    const payload = new PickOutPaversScheduleUpdatedEvent(user, project);
    const event: Event = await this.eventService.addEvent(payload);
    this.socketService.event$.next(event);
    return event;
  }

  async customerRequestedSiteVisitChangeEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedSiteVisitScheduleChangeEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }

  async customerRequestedPickOutPaversChangeEvent(users: User[], project: Project): Promise<Event[]> {
    return Promise.all(users.map(async user => {
      const payload = new CustomerRequestedPickOutPaversScheduleChangeEvent(user, project);
      const event: Event = await this.eventService.addEvent(payload);
      this.socketService.event$.next(event);
      return event;
    }));
  }
}
