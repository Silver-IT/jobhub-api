import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PageVisitHistory } from './entities/page-visit-history.entity';
import { LogPageVisitHistoryDto } from './dtos/log-page-visit-history.dto';
import { saveDtoToRepository } from '../common/utils/repository.util';
import { PageVisitHistoryOverviewDto } from './dtos/page-visit-history-overview.dto';
import { formatTimeByUnit } from '../common/utils/time.util';
import { ReportFilterDto } from '../common/dtos/report-filter.dto';
import { SessionCountDto } from './dtos/session-count.dto';
import { DEFAULT_FROM_DATE, DEFAULT_TO_DATE } from '../common/enums/time.enum';

@Injectable()
export class MarketingService {
  
  constructor(
    @InjectRepository(PageVisitHistory)
    private pageVisitHistoryRepository: Repository<PageVisitHistory>
  ) {
  }

  async logPageVisitHistory(payload: LogPageVisitHistoryDto): Promise<PageVisitHistory> {
    if (payload.id) {
      const found = await this.pageVisitHistoryRepository.findOne({ id: payload.id });
      if (found) {
        await this.pageVisitHistoryRepository.update({ id: payload.id }, {});
        return { ...found, updatedAt: new Date().toISOString() };
      }
    }
    return saveDtoToRepository<PageVisitHistory>(payload, new PageVisitHistory(), this.pageVisitHistoryRepository)
  }

  getPageVisitHistory(): Promise<PageVisitHistoryOverviewDto[]> {
    return this.pageVisitHistoryRepository.createQueryBuilder('page_visit_history')
      .select('page_visit_history.page AS page')
      .addSelect('page_visit_history.sub AS sub')
      .addSelect('COUNT(page_visit_history.id) AS count')
      .groupBy('page_visit_history.page')
      .addGroupBy('page_visit_history.sub')
      .orderBy('count', 'DESC')
      .getRawMany();
  }

  getOverallTrafficHistory(query: ReportFilterDto): Promise<SessionCountDto[]> {
    return this.pageVisitHistoryRepository.createQueryBuilder('page_visit_history')
      .select(`TO_CHAR(page_visit_history.createdAt, '${formatTimeByUnit(query.unit)}') AS "date"`)
      .addSelect('COUNT(page_visit_history.createdAt) AS count')
      .where('page_visit_history.createdAt >= :from', {from: query.from || DEFAULT_FROM_DATE})
      .andWhere('page_visit_history.createdAt <= :to', {to: query.to || DEFAULT_TO_DATE})
      .groupBy('"date"')
      .getRawMany();
  }
  
}
