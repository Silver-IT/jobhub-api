import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, LessThanOrEqual, MoreThanOrEqual, Not, Repository } from 'typeorm';

import { LogRocketRecording } from './entities/log-rocket-recording.entity';
import { SaveRecordingDto } from './dtos/save-recording.dto';
import { FilterRecordingDto } from './dtos/filter-recording.dto';
import { defaultTakeCount } from '../common/constants/general.constants';

@Injectable()
export class LogRocketService {

  constructor(
    @InjectRepository(LogRocketRecording)
    private readonly logRocketRecordingRepository: Repository<LogRocketRecording>
  ) {
  }

  findById(id: string): Promise<LogRocketRecording> {
    return this.logRocketRecordingRepository.findOne({ id });
  }

  findByRecordingId(recordingId: string): Promise<LogRocketRecording> {
    return this.logRocketRecordingRepository.findOne({ recordingId });
  }

  find(query: FilterRecordingDto): Promise<[LogRocketRecording[], number]> {
    const filter: any = {} as any;
    // recording resolve status
    if (query.resolved === true || query.resolved === 'true') {
      filter.isResolved = true;
    } else if (query.resolved === false || query.resolved === 'false') {
      filter.isResolved = false;
    }
    // recording authorization status
    if (query.authorized === true || query.authorized === 'true') {
      filter.email = Not(IsNull());
    } else if (query.authorized === false || query.authorized === 'false') {
      filter.email = IsNull();
    }
    // recording filter by email
    if (query.email) {
      filter.email = query.email;
    }
    // recording filter by date
    if (query.from && query.to) {
      filter.createdAt = Between(new Date(filter.startAt), new Date(filter.endAt));
    } else if (filter.startAt) {
      filter.createdAt = MoreThanOrEqual(new Date(filter.startAt));
    } else if (filter.endAt) {
      filter.createdAt = LessThanOrEqual(new Date(filter.endAt));
    }
    return this.logRocketRecordingRepository.findAndCount({
      where: filter,
      order: { createdAt: 'DESC' },
      skip: query.skip || 0,
      take: query.take || defaultTakeCount
    });
  }

  async saveRecording(payload: SaveRecordingDto): Promise<LogRocketRecording> {
    let recording = await this.findByRecordingId(payload.recordingId);
    if (!recording) {
      recording = new LogRocketRecording();
      recording.recordingId = payload.recordingId;
    }
    recording.email = payload.email || null;
    recording.firstName = payload.firstName || null;
    recording.lastName = payload.lastName || null;

    return this.logRocketRecordingRepository.save(recording);
  }

  async markRecordingAsResolved(id: string, resolved = true): Promise<LogRocketRecording> {
    const found = await this.findById(id);
    if (!found) {
      return null;
    } else {
      found.isResolved = resolved;
      return this.logRocketRecordingRepository.save(found);
    }
  }

}
