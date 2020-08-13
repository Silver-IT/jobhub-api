import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, LessThan, MoreThan, Repository } from 'typeorm';

import { ImageAttachment } from '../entities/image-attachment.entity';
import { Project } from '../entities/project.entity';
import { FinalProposal } from './entities/final-proposal.entity';
import { FinalProposalDto } from './dtos/final-proposal.dto';
import { getFromDto } from '../../common/utils/repository.util';
import { FinalProposalStatus } from './enums';
import { AccessoryLayout } from './entities/accessory-layout.entity';
import { ProcedureStep } from './entities/procedure-step.entity';
import { ProjectProcedure } from './entities/project-procedure.entity';
import { CostEstimate } from './entities/cost-estimate.entity';
import { Estimate } from '../estimate/entities/estimate.entity';
import { defaultProcedureSteps, defaultRemovalOfExistingMaterialText } from './data';

@Injectable()
export class FinalProposalService {

  constructor(
    @InjectRepository(FinalProposal) private finalProposalRepository: Repository<FinalProposal>,
    @InjectRepository(AccessoryLayout) private accessoryLayoutRepository: Repository<AccessoryLayout>,
    @InjectRepository(ProcedureStep) private procedureStepRepository: Repository<ProcedureStep>,
    @InjectRepository(CostEstimate) private costEstimateRepository: Repository<CostEstimate>,
    @InjectRepository(ProjectProcedure) private projectProcedureRepository: Repository<ProjectProcedure>,
    @InjectRepository(Project) private projectRepository: Repository<Project>,
    @InjectRepository(ImageAttachment) private attachmentRepository: Repository<ImageAttachment>,
  ) {
  }

  findById(id: string): Promise<FinalProposal> {
    return this.finalProposalRepository.findOne({
      relations: ['project', 'project.customer', 'project.customer.user'],
      where: { id },
    });
  }

  async findProposalFromProjectId(id: string): Promise<FinalProposal> {
    const proposal = await this.finalProposalRepository.createQueryBuilder('final_proposal')
      .leftJoinAndSelect('final_proposal.project', 'project')
      .leftJoinAndSelect('final_proposal.attachments', 'attachments')
      .leftJoinAndSelect('final_proposal.layouts', 'layouts')
      .leftJoinAndSelect('final_proposal.procedures', 'procedures')
      .leftJoinAndSelect('procedures.steps', 'procedures.steps')
      .leftJoinAndSelect('final_proposal.costEstimates', 'costEstimates')
      .where('project.id = :id', { id })
      .getOne();
    if (proposal) {
      const costEstimates = [...proposal.costEstimates];
      proposal.costEstimates = [];
      proposal.layouts.forEach(layout => {
        const type = layout.type;
        const iEstimate = costEstimates.findIndex(e => e.type === type);
        proposal.costEstimates.push(costEstimates[iEstimate]);
        costEstimates.splice(iEstimate, 1);
      });
    }
    return proposal;
  }

  async saveProposal(project: Project, attachments: ImageAttachment[], body: FinalProposalDto) {
    const finalProposal = getFromDto<FinalProposal>(body, new FinalProposal());
    finalProposal.attachments = attachments;
    finalProposal.costEstimates = await this.costEstimateRepository.save(body.costEstimates.map(costEstimate => getFromDto<CostEstimate>(costEstimate, new CostEstimate())));

    finalProposal.procedures = await this.projectProcedureRepository.save(await Promise.all(body.procedures.map(async procedureDto => {
        const newProcedure = getFromDto<ProjectProcedure>(procedureDto, new ProjectProcedure());
        newProcedure.steps = await this.procedureStepRepository.save(procedureDto.steps.map(step => getFromDto<ProcedureStep>(step, new ProcedureStep())));
        return newProcedure;
      })),
    );
    finalProposal.layouts = await this.accessoryLayoutRepository.save(await Promise.all(body.layouts.map(async layoutDto => {
        const newLayout = getFromDto<AccessoryLayout>(layoutDto, new AccessoryLayout());
        newLayout.attachments = await this.attachmentRepository.save(layoutDto.attachments.map(attachment => getFromDto<ImageAttachment>(attachment, new ImageAttachment())));
        return newLayout;
      }),
    ));

    finalProposal.project = project;
    await this.finalProposalRepository.save(finalProposal);
    return this.findProposalFromProjectId(project.id);
  }

  async findByDate(fromDate: Date, toDate: Date): Promise<FinalProposal[]> {
    return this.finalProposalRepository.find({
      relations: ['project', 'project.customer', 'project.customer.user'],
      where: [
        { status: FinalProposalStatus.Accepted, startDate: Between(fromDate, toDate) },
        { status: FinalProposalStatus.Accepted, endDate: Between(fromDate, toDate) },
        { status: FinalProposalStatus.Accepted, startDate: LessThan(fromDate), endDate: MoreThan(toDate) },
      ],
    });
  }

  async updateCostEstimates(costEstimates: CostEstimate[]): Promise<CostEstimate[]> {
    return this.costEstimateRepository.save(costEstimates);
  }

  async updateProposal(proposal: FinalProposal): Promise<FinalProposal> {
    return this.finalProposalRepository.save(proposal);
  }

  getEmptyFinalProposalFromEstimate(estimate: Estimate): FinalProposalDto {
    const finalProposal = new FinalProposalDto();
    finalProposal.existingSiteAssessment = 'The current location is just grass, there is a section of stamped concrete that we will go over and there is a small area of pavers near the house that needs to be removed. We will also be removing a few bushes on the property and will access the property from the side street. It should be noted there is a lot of underground wires in the location of the project.';
    finalProposal.paversSize = 'Given that this is a patio project in a rather modern neighborhood with an average amount of square footage. We would recommend a slightly larger paver, (Techo-bloc Blu or Cambridge Ledge Stone XL)';
    finalProposal.paversColor = 'We recommend that the customer choose a color that will either blend with the existing house color or choose a more neutral color like Shale or Champlain Grey. Additionally, it is recommended that the patio have a border that outlines it and that this border brick color is slightly different from the core color. (Samples and pictures can be provided upon request).';
    finalProposal.paversQuality = 'Though there are many paver brands to choose from, we recommend Techo-Bloc brand pavers. Techo-Bloc  is superior when it comes to customer service and provides a lifetime warranty on its products. Select products are rock salt resistant, colors are consistent throughout the entire block and they provide a large selection of colors and styles to choose from.';
    finalProposal.layouts = [
      new AccessoryLayout(estimate.projectType, estimate.coreProjectComment, []),
      ...estimate.items.map(item => new AccessoryLayout(item.type, item.comment, [])),
    ];
    finalProposal.existingMaterialRemoval = defaultRemovalOfExistingMaterialText;
    finalProposal.procedures = [new ProjectProcedure(estimate.projectType, defaultProcedureSteps.map(step => new ProcedureStep(step.title, step.comment)))];
    finalProposal.workPlan = 'The project would be completed in three (3) days and our current schedule is aprox 3 weeks out from execution of the project.';
    finalProposal.attachments = [];
    finalProposal.costEstimates = [new CostEstimate(estimate.projectType, 0, estimate.coreProjectComment, true), ...estimate.items.map(item => new CostEstimate(item.type, 0, item.comment, true))];
    finalProposal.discount = 0;
    finalProposal.applyTax = true;
    finalProposal.status = FinalProposalStatus.Pending;
    return finalProposal;
  }
}
