import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CostEstimate } from '../project/final-proposal/entities/cost-estimate.entity';
import { AccessoryLayout } from '../project/final-proposal/entities/accessory-layout.entity';
import { ImageAttachment } from '../project/entities/image-attachment.entity';

@Injectable()
export class ContractService {
  constructor(
    @InjectRepository(CostEstimate) private costEstimateRepository: Repository<CostEstimate>,
    @InjectRepository(AccessoryLayout) private layoutsRepository: Repository<AccessoryLayout>,
    @InjectRepository(ImageAttachment) private imageAttachmentRepository: Repository<ImageAttachment>,
  ) {
  }
}
