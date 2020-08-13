import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, LessThanOrEqual, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';

import { Schedule } from './entities/schedule.entity';
import { Project } from '../project/entities/project.entity';
import { ScheduleType } from './enums';

@Injectable()
export class ScheduleService {

  constructor(
    @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>,
  ) {
  }

  async addPickOutPaversSchedule(project: Project, from: Date, to: Date): Promise<Schedule> {
    const schedule = new Schedule();
    schedule.from = from;
    schedule.to = to;
    schedule.type = ScheduleType.PickOutPaver;
    schedule.project = project;
    const added = await this.scheduleRepository.save(schedule);
    return this.findPickOutPaverScheduleFromId(added.id);
  }

  async setDone(id: string, done: boolean): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ id });
    await this.scheduleRepository.update({ id }, { done });
    if (schedule.type === ScheduleType.SiteVisitSchedule) {
      return this.findSiteVisitScheduleFromId(id);
    }
    if (schedule.type === ScheduleType.PickOutPaver) {
      return this.findPickOutPaverScheduleFromId(id);
    }
  }

  async updateScheduleDate(id: string, from: Date, to: Date): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({ id });
    await this.scheduleRepository.update({ id }, { from, to });
    if (schedule.type === ScheduleType.SiteVisitSchedule) {
      return this.findSiteVisitScheduleFromId(id);
    }
    if (schedule.type === ScheduleType.PickOutPaver) {
      return this.findPickOutPaverScheduleFromId(id);
    }
  }

  findSiteVisitScheduleFromId(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      relations: ['estimate', 'estimate.project', 'estimate.project.customer', 'estimate.project.customer.user'],
      where: { id },
    });
  }

  findPickPaversScheduleByDate(fromDate: Date, toDate: Date): Promise<Schedule[]> {
    return this.scheduleRepository.find({
      relations: ['project', 'project.customer', 'project.customer.user'],
      where: [
        { from: LessThanOrEqual(fromDate), to: MoreThan(fromDate), type: ScheduleType.PickOutPaver },
        { from: MoreThanOrEqual(fromDate), to: LessThanOrEqual(toDate), type: ScheduleType.PickOutPaver },
        { from: LessThan(toDate), to: MoreThanOrEqual(toDate), type: ScheduleType.PickOutPaver },
      ],
    });
  }

  findPickOutPaverScheduleFromId(id: string): Promise<Schedule> {
    return this.scheduleRepository.findOne({
      relations: ['project', 'project.customer', 'project.customer.user'],
      where: { id },
    });
  }
}
