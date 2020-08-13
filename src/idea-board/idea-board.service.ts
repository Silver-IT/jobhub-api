import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { Idea } from './entities/idea.entity';
import { ProjectAccessoryType } from '../project/enums';
import { MaterialType } from './enums';
import { SuccessResponse } from '../common/models/success-response';
import { UpdateIdeaBoardDto } from './dtos/create-idea-board.dto';
import { getFromDto } from '../common/utils/repository.util';

@Injectable()
export class IdeaBoardService {

  constructor(
    @InjectRepository(Idea)
    private readonly ideaRepository: Repository<Idea>,
  ) {
  }

  find(skip: number, take: number): Promise<Idea[]> {
    return this.ideaRepository.find({ skip, take });
  }

  findByIds(ids: string[]): Promise<Idea[]> {
    return this.ideaRepository.findByIds(ids);
  }

  findById(id: string): Promise<Idea> {
    return this.ideaRepository.findOne({ id });
  }

  count(): Promise<number> {
    return this.ideaRepository.count();
  }

  async add(url: string, projectType: ProjectAccessoryType, materialTypes: MaterialType[]): Promise<SuccessResponse> {
    const idea = new Idea();
    idea.url = url;
    idea.projectType = projectType;
    idea.materialTypes = materialTypes;
    await this.ideaRepository.save(idea);
    return new SuccessResponse(true);
  }

  async availableNumber(): Promise<number> {
    const result = await this.ideaRepository.createQueryBuilder('idea')
      .select('MAX(idea.indexNumber)', 'max')
      .getRawOne();
    return result.max + 1;
  }

  async bulkAdd(ideas: Idea[]): Promise<Idea[]> {
    return this.ideaRepository.save(ideas);
  }

  async getAllIdeaBoardItems(skip: number, take: number, projectType: ProjectAccessoryType, materialType: MaterialType): Promise<Idea[]> {
    let query = {};
    if (projectType) {
      query = { ...query, projectType };
    }
    if (materialType) {
      query = { ...query, materialTypes: [materialType] };
    }
    return this.ideaRepository.find({ where: query, skip, take });
  }

  async getIdeaBoardItemsAsBlock(projectType: ProjectAccessoryType, count: number): Promise<Idea[]> {
    const all = await this.ideaRepository.find(projectType ? { projectType } : {});
    const totalCount = all.length;

    all.sort((i1, i2) => {
      const r1 = i1.width / i1.height;
      const r2 = i2.width / i2.height;
      return r1 > r2 ? 1 : -1;
    });
    const squares = all.map(idea => idea);
    squares.sort((i1, i2) => {
      const r1 = Math.abs(1 - i1.width / i1.height);
      const r2 = Math.abs(1 - i2.width / i2.height);
      return r1 > r2 ? 1 : -1;
    });
    const result = Array(6 * count);
    for (let i = 0; i < count; i++) {
      result[5 + i * 6] = all[i];
      result[4 + i * 6] = all[totalCount - i - 1];
      for (let j = 0; j < 4; j++) {
        result[j + i * 6] = squares[j + 4 * i];
      }
    }
    return result.filter(idea => idea);
  }

  async getAllIdeaBoardItemsByUserId(userId: string, projectType: ProjectAccessoryType, materialType: MaterialType): Promise<Idea[]> {
    let query = {};
    if (projectType) {
      query = { ...query, projectType };
    }
    if (materialType) {
      query = { ...query, materialTypes: [materialType] };
    }
    return this.ideaRepository.createQueryBuilder('idea')
      .leftJoinAndSelect('idea.users', 'users')
      .where(query)
      .andWhere('users.id  = :userId', { userId })
      .getMany();
  }

  async getIdeaBoardItemsByUserId(userId: string, skip: number, take: number, projectType: ProjectAccessoryType, materialType: MaterialType): Promise<Idea[]> {
    if (take === -1) {
      take = 99999;
    }
    let query = {};
    if (projectType) {
      query = { ...query, projectType };
    }
    if (materialType) {
      query = { ...query, materialTypes: [materialType] };
    }
    return this.ideaRepository.createQueryBuilder('idea')
      .leftJoinAndSelect('idea.users', 'users')
      .where(query)
      .andWhere('users.id  = :userId', { userId })
      .skip(skip)
      .take(take)
      .getMany();
  }

  async updateIdeaBoardItem(id: string, body: UpdateIdeaBoardDto): Promise<Idea> {
    let idea = await this.ideaRepository.findOne({ id });
    if (!idea) {
      throw new BadRequestException('Could not find the idea-board item.');
    }
    idea = getFromDto(body, idea);
    return this.ideaRepository.save(idea);
  }

  async deleteIdeaBoardItem(id: string): Promise<SuccessResponse> {
    await this.ideaRepository.softDelete({ id });
    return new SuccessResponse(true);
  }
}
