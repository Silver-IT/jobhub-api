import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NetworkContractorDto } from './dtos/network-contractor.dto';
import { NetworkContractor } from './entities/network-contractor.entity';
import { NetworkContractorCategory } from './entities/network-contractor-category.entity';
import { getFromDto, saveDtoToRepository } from '../common/utils/repository.util';
import { SuccessResponse } from '../common/models/success-response';
import {
  NetworkContractorCategoryDto,
  UpdateNetworkContractorCategoryDto,
} from './dtos/network-contractor-category.dto';

@Injectable()
export class NetworkContractorService {
  constructor(
    @InjectRepository(NetworkContractor)
    private networkContractorRepository: Repository<NetworkContractor>,
    @InjectRepository(NetworkContractorCategory)
    private categoryRepository: Repository<NetworkContractorCategory>,
  ) {
  }

  async addOne(data: NetworkContractorDto): Promise<NetworkContractor> {
    const contractor = await getFromDto<NetworkContractor>(data, new NetworkContractor());
    contractor.category = await this.findCategoryById(data.category);
    return this.networkContractorRepository.save(contractor);
  }

  async addMany(data: NetworkContractorDto[]): Promise<NetworkContractor[]> {
    const categories = await this.categoryRepository.findByIds(data.map(contractor => contractor.category));
    const dictCategory = {};
    categories.forEach(category => dictCategory[category.id] = category);
    const contractors = data.map(dto => {
      const contractor = getFromDto<NetworkContractor>(dto, new NetworkContractor());
      contractor.category = dictCategory[dto.category];
      return contractor;
    });
    return this.networkContractorRepository.save(contractors);
  }

  async update(id: string, data: NetworkContractorDto): Promise<NetworkContractor> {
    let networkContractor = await this.findContractorById(id);
    if (!networkContractor) {
      throw new BadRequestException('Could not find the network contractor.');
    }
    networkContractor = getFromDto<NetworkContractor>(data, new NetworkContractor());
    networkContractor.id = id;
    networkContractor.category = await this.findCategoryById(data.category);
    return this.networkContractorRepository.save(networkContractor);
  }

  async findContractorById(id: string): Promise<NetworkContractor> {
    const networkContractor = await this.networkContractorRepository.findOne({
      relations: ['category'],
      where: { id, deletedAt: null },
    });
    if (!networkContractor) {
      throw new BadRequestException('Could not find the network contractor.');
    }
    return networkContractor;
  }

  contractors(skip: number, take: number): Promise<[NetworkContractor[], number]> {
    return this.networkContractorRepository.findAndCount({
      relations: ['category'], where: { deletedAt: null }, skip, take
    });
  }

  findContractorsByKeyword(keyword: string): Promise<NetworkContractor[]> {
    return this.networkContractorRepository.createQueryBuilder('network_contractor')
      .leftJoinAndSelect('network_contractor.category', 'category')
      .where('LOWER(network_contractor.companyName) like :keyword', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(network_contractor.address) like :keyword', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(network_contractor.contacts) like :keyword', { keyword: '%' + keyword + '%' })
      .getMany();
  }

  async deleteOne(id: string): Promise<SuccessResponse> {
    const networkContractor = await this.findContractorById(id);
    await this.networkContractorRepository.softRemove(networkContractor);
    return new SuccessResponse(true);
  }

  async count(): Promise<number> {
    return this.networkContractorRepository.count();
  }

  async addCategories(dtos: NetworkContractorCategoryDto[]): Promise<NetworkContractorCategory[]> {
    return this.categoryRepository.save(dtos.map(dto => getFromDto<NetworkContractorCategory>(dto, new NetworkContractorCategory())));
  }

  async addCategory(dto: NetworkContractorCategoryDto): Promise<NetworkContractorCategory> {
    return saveDtoToRepository<NetworkContractorCategory>(dto, new NetworkContractorCategory(), this.categoryRepository);
  }

  async updateCategory(id: string, dto: UpdateNetworkContractorCategoryDto): Promise<NetworkContractorCategory> {
    const category = getFromDto<NetworkContractorCategory>(dto, new NetworkContractorCategory());
    return this.categoryRepository.save(category);
  }

  async findCategoryById(id: string): Promise<NetworkContractorCategory> {
    const category = await this.categoryRepository.findOne({ id });
    if (!category) {
      throw new BadRequestException('Could not find the category.');
    }
    return category;
  }

  async categories(skip: number, take: number): Promise<[NetworkContractorCategory[], number]> {
    return this.categoryRepository.findAndCount({ skip, take });
  }

  async deleteCategory(id: string): Promise<SuccessResponse> {
    const deleted = await this.categoryRepository.softDelete({ id });
    if (!deleted) {
      throw new BadRequestException('Could not find network contractor category item.');
    }
    return new SuccessResponse(true);
  }
}
