import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Idea } from './entities/idea.entity';

import { IdeaBoardController } from './idea-board.controller';
import { IdeaBoardService } from './idea-board.service';
import { jwtConstants } from '../common/constants/general.constants';
import { UsersModule } from '../users/users.module';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Idea]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    forwardRef(() => UsersModule),
  ],
  controllers: [IdeaBoardController],
  providers: [IdeaBoardService, UploadService],
  exports: [IdeaBoardService],
})
export class IdeaBoardModule {
}
