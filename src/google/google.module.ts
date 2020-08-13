import { HttpModule, Module } from '@nestjs/common';
import { GoogleService } from './google.service';

@Module({
  imports: [
    HttpModule,
  ],
  exports: [
    GoogleService
  ],
  providers: [GoogleService]
})
export class GoogleModule {}
