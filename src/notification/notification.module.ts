import { forwardRef, Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { ProjectModule } from '../project/project.module';
import { EventModule } from '../event/event.module';
import { SocketModule } from '../socket/socket.module';

import { NotificationService } from './notification.service';

@Module({
  imports: [
    EventModule,
    SocketModule,
    forwardRef(() => UsersModule),
    forwardRef(() => ProjectModule),
  ],
  providers: [
    NotificationService
  ],
  exports: [
    NotificationService
  ]
})
export class NotificationModule {}
