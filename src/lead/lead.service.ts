import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { SortByDateType } from '../common/enums/query.enum';
import { Lead } from './entities/lead.entity';
import { LeadDto } from './dtos/lead.dto';
import { LeadStatus } from './enums';

@Injectable()
export class LeadService {

  constructor(
    @InjectRepository(Lead)
    private readonly repository: Repository<Lead>,
  ) {
  }

  add(payload: Lead): Promise<Lead> {
    return this.repository.save(payload);
  }

  findAll(skip: number, take: number, sortByDate: SortByDateType, status: LeadStatus): Promise<[Lead[], number]> {
    return this.repository.findAndCount({
      skip,
      take,
      where: status ? { status } : { status: Not(LeadStatus.Archived) },
      order: { createdAt: sortByDate === SortByDateType.MostRecent ? 'DESC' : 'ASC' },
    });
  }

  findLeadById(id: string): Promise<Lead> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async updateLeadById(id: string, payload: LeadDto): Promise<Lead> {
    const lead = await this.repository.findOne({ id });
    if (!lead) {
      throw new BadRequestException('Could not find the lead for id.');
    }
    await this.repository.update({ id }, payload);
    return this.findLeadById(id);
  }

  updateLeadStatusByEmail(email: string, status: LeadStatus) {
    this.repository.update({ email }, { status });
  }

  updateLeadStatusById(id: string, status: LeadStatus) {
    this.repository.update({ id }, { status });
  }
}
