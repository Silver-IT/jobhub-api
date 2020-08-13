import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { ScheduleStatus, ScheduleType } from '../enums';
import { Project } from '../../project/entities/project.entity';
import { Estimate } from '../../project/estimate/entities/estimate.entity';
import { ScheduleDto } from '../dtos/schedule.dto';
import { FinalProposal } from '../../project/final-proposal/entities/final-proposal.entity';
import { EstimateStatus } from '../../project/enums';
import { FinalProposalStatus } from '../../project/final-proposal/enums';

@Entity('schedule')
export class Schedule extends SoftDelete {
  @Column({ type: 'enum', enum: ScheduleType, default: ScheduleType.SiteVisitSchedule })
  type: ScheduleType;

  @Column()
  from: Date;

  @Column()
  to: Date;

  @Column({ default: false })
  reminderSent: boolean;

  @Column({ default: false })
  done: boolean;

  @OneToOne(() => Project, project => project.pickOutPaverSchedule)
  project: Project; // available only when type = PickOutPaver

  @ManyToOne(() => Estimate, estimate => estimate.siteVisitSchedules)
  estimate: Estimate;

  toDto(): ScheduleDto {
    if (this.type === ScheduleType.PickOutPaver) {
      return Schedule.toPickPaversScheduleDto(this);
    } else if (this.type === ScheduleType.SiteVisitSchedule) {
      return Schedule.toSiteVisitScheduleDto(this);
    }
  }

  static toConstructionScheduleDto(proposal: FinalProposal): ScheduleDto {
    const now = new Date();
    let status = ScheduleStatus.Pending;
    if (proposal.status === FinalProposalStatus.Declined) {
      status = ScheduleStatus.Declined;
    } else if (proposal.status === FinalProposalStatus.Accepted) {
      if (proposal.endDate <= now) {
        status = ScheduleStatus.Done;
      } else if (proposal.startDate <= now && now < proposal.endDate) {
        status = ScheduleStatus.Accepted;
      } else {
        status = ScheduleStatus.Pending;
      }
    }
    return {
      id: proposal.id,
      type: ScheduleType.ProjectStart,
      from: proposal.startDate,
      to: proposal.endDate,
      status,
      data: {
        id: proposal.project.id,
        name: proposal.project.name,
        user: proposal.project.customer.user,
        project: proposal.project,
      },
    };
  }

  static toPickPaversScheduleDto(schedule: Schedule): ScheduleDto {
    const now = new Date();
    let status = ScheduleStatus.Pending;
    if (schedule.to <= now) {
      status = schedule.done ? ScheduleStatus.Done : ScheduleStatus.Expired;
    }
    return {
      id: schedule.id,
      type: ScheduleType.PickOutPaver,
      from: schedule.from,
      to: schedule.to,
      status,
      data: {
        id: schedule.project.id,
        name: schedule.project.name,
        user: schedule.project.customer.user,
        project: schedule.project,
      },
    };
  }

  private static toSiteVisitScheduleDto(visitSchedule: Schedule): ScheduleDto {
    const now = new Date();
    let status = ScheduleStatus.Pending;
    switch (visitSchedule.estimate.status) {
      case EstimateStatus.Declined:
        status = ScheduleStatus.Declined;
        break;
      case EstimateStatus.SiteVisitScheduled:
        status = visitSchedule.to <= now ? ScheduleStatus.Done : ScheduleStatus.Accepted;
        break;
      case EstimateStatus.Pending:
        if (visitSchedule.to <= now) {
          status = ScheduleStatus.Expired;
        }
    }

    return {
      id: visitSchedule.id,
      type: ScheduleType.SiteVisitSchedule,
      from: visitSchedule.from,
      to: visitSchedule.to,
      status,
      data: {
        id: visitSchedule.estimate.project.id,
        name: visitSchedule.estimate.project.name,
        user: visitSchedule.estimate.project.customer.user,
        project: visitSchedule.estimate.project,
      },
    };
  }
}
