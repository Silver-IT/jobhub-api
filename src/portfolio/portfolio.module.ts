import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Portfolio } from './entities/portfolio.entity';
import { PortfolioService } from './portfolio.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Portfolio]),
  ],
  providers: [PortfolioService],
})
export class PortfolioModule {
}
