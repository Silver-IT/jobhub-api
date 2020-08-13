import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocketModule } from '../socket/socket.module';
import { LogRocketController } from './log-rocket.controller';
import { LogRocketService } from './log-rocket.service';
import { LogRocketRecording } from './entities/log-rocket-recording.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([LogRocketRecording]),
    SocketModule,
  ],
  controllers: [
    LogRocketController
  ],
  providers: [
    LogRocketService
  ]
})
export class LogRocketModule {}
