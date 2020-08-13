import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MaterialRequest } from './entities/material-request.entity';
import { getFromDto } from '../../common/utils/repository.util';
import { Project } from '../entities/project.entity';
import { MaterialRequestDto } from './dtos/material-request.dto';

@Injectable()
export class MaterialRequestService {
  constructor(
    @InjectRepository(MaterialRequest) private materialRequestRepository: Repository<MaterialRequest>,
  ) {
  }

  findByProjectId(projectId: string): Promise<MaterialRequest[]> {
    return this.materialRequestRepository.createQueryBuilder('material_request')
      .leftJoinAndSelect('material_request.project', 'project')
      .where('project.id = :projectId', { projectId })
      .getMany();
  }

  async save(project: Project, payload: MaterialRequestDto[]): Promise<MaterialRequest[]> {
    const materials = payload.map(a => {
      const materialRequest = getFromDto<MaterialRequest>(a, new MaterialRequest());
      materialRequest.project = project;
      return materialRequest;
    });
    await this.materialRequestRepository.save(materials);
    return this.findByProjectId(project.id);
  }
}
