import { ApiProperty } from '@nestjs/swagger';
import { Event } from '../entities/event.entity';

export class EventPagination {
  @ApiProperty({ type: Event, isArray: true })
  readonly events: Event[];

  @ApiProperty({ type: Number })
  readonly total: number;

  constructor(events: Event[], total: number) {
    this.events = events;
    this.total = total;
  }
}
