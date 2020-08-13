import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerVisitHistory } from './entities/customer-visit-history.entity';
import { PageType } from '../common/enums/page-type.enum';
import { Project } from '../project/entities/project.entity';

@Injectable()
export class CustomerVisitHistoryService {

  constructor(
    @InjectRepository(CustomerVisitHistory)
    private customerVisitHistory: Repository<CustomerVisitHistory>,
  ) {
  }

  async logCustomerPageVisitHistory(page: PageType, project: Project, id?: string): Promise<CustomerVisitHistory> {
    if (id) {
      const found = await this.customerVisitHistory.findOne(id);
      if (found) {
        await this.customerVisitHistory.update({ id }, {});
        return { ...found, updatedAt: new Date().toISOString() };
      }
    }
    return this.customerVisitHistory.save(new CustomerVisitHistory(page, project));
  }

  async getCustomerVisitHistoryByProjectId(id: string): Promise<CustomerVisitHistory[]> {
    const res = await this.customerVisitHistory.createQueryBuilder('customer_visit_history')
      .leftJoinAndSelect('customer_visit_history.project', 'project')
      .where('project.id = :id', { id })
      .addOrderBy('customer_visit_history.createdAt', 'DESC')
      .getMany();
    return res.map(x => ({
      id: x.id, createdAt: x.createdAt, updatedAt: x.updatedAt, page: x.page, projectId: x.project.id
    } as any));
  }
}
