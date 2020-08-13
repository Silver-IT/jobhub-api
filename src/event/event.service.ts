import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Event } from './entities/event.entity';
import { getFromDto } from '../common/utils/repository.util';
import { SuccessResponse } from '../common/models/success-response';
import { EventPagination } from './models/event-pagination';

@Injectable()
export class EventService {

  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>
  ) {
  }

  addEvent(payload: any): Promise<Event> {
    const event = getFromDto<Event>(payload, new Event());
    return this.eventRepository.save(event);
  }

  async getEventsByUserId(id: string, skip: number, take: number): Promise<EventPagination> {
    const res = await this.eventRepository.findAndCount(
      {
        relations: ['user'],
        order: {createdAt: 'DESC'},
        where: {
          readAt: null,
          user: { id },
        },
        skip,
        take,
      },
    );
    return new EventPagination(...res);
  }

  async readEvent(id: string): Promise<SuccessResponse> {
    const event = await this.eventRepository.findOne({id});
    if (event) {
      event.readAt = new Date().toISOString();
      await this.eventRepository.save(event);
      return new SuccessResponse(true);
    } else {
      return new SuccessResponse(false);
    }
  }

  async readAll(id: string): Promise<SuccessResponse> {
    const events = await this.eventRepository.find(
      {
        relations: ['user'],
        where: {
          readAt: null,
          user: { id },
        }
      },
    );
    events.forEach(e => e.readAt = new Date().toISOString());
    await this.eventRepository.save(events);
    return new SuccessResponse(true);
  }

}
