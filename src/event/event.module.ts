import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Event } from './entities/event.entity';

import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event])
  ],
  providers: [EventService],
  controllers: [EventController],
  exports: [EventService]
})
export class EventModule {}
