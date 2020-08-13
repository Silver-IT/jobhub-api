import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Job } from './entities/job.entity';
import { Applicant } from './entities/applicant.entity';
import { getFromDto } from '../common/utils/repository.util';
import { SuccessResponse } from '../common/models/success-response';
import { AddJobDto } from './dtos/add-job.dto';
import { ApplyJobDto } from './dtos/apply-job.dto';

@Injectable()
export class JobsService {

  constructor(
    @InjectRepository(Job)
    private readonly jobRepository: Repository<Job>,
    @InjectRepository(Applicant)
    private readonly applicantRepository: Repository<Applicant>,
  ) {
  }

  count(): Promise<number> {
    return this.applicantRepository.createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.job', 'job')
      .where('job.deletedAt is null')
      .getCount();
  }

  findAllJobs(skip: number, take: number): Promise<[Job[], number]> {
    return this.jobRepository.findAndCount({ skip, take });
  }

  async findAllApplicants(skip: number, take: number): Promise<[Applicant[], number]> {
    const applicants = await this.applicantRepository.createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.job', 'job')
      .where('job.deletedAt is null')
      .skip(skip)
      .take(take)
      .getMany();
    const count = await this.applicantRepository.createQueryBuilder('applicant')
      .leftJoinAndSelect('applicant.job', 'job')
      .where('job.deletedAt is null')
      .getCount();
    return [applicants, count];
  }

  async findJobById(id: string): Promise<Job> {
    const job = await this.jobRepository.findOne({ relations: ['applicants'], where: { deletedAt: null, id } });
    if (!job) {
      throw new BadRequestException(`Invalid job reference.`);
    }
    return job;
  }

  async findApplicantById(id: string): Promise<Applicant> {
    const applicant = await this.applicantRepository.findOne({
      relations: ['job'],
      where: {
        id,
        isDeleted: false,
        job: {
          isDeleted: false,
        },
      },
    });
    if (!applicant) {
      throw new BadRequestException(`Invalid applicant reference`);
    }
    return applicant;
  }

  addJob(data: AddJobDto, applicants: Applicant[] = []): Promise<Job> {
    const job = getFromDto<Job>(data, new Job());
    if (applicants.length !== 0) {
      job.applicants = applicants;
    }
    return this.jobRepository.save(job);
  }

  async addJobApplicants(applyJobDtos: ApplyJobDto[]): Promise<Applicant[]> {
    return this.applicantRepository.save(applyJobDtos.map(applicant => getFromDto<Applicant>(applicant, new Applicant())));
  }

  async updateJob(id: string, payload: AddJobDto): Promise<Job> {
    let job = await this.findJobById(id);
    job = getFromDto<Job>(payload, job);
    return this.applicantRepository.save(job);
  }

  async deleteJob(id: string): Promise<SuccessResponse> {
    const job = await this.findJobById(id);
    await this.jobRepository.softRemove(job);
    return new SuccessResponse(true);
  }

  async jobCount(): Promise<number> {
    return this.jobRepository.count();
  }

  async applyForJob(jobId: string, payload: ApplyJobDto): Promise<Applicant> {
    const candidate = getFromDto<Applicant>(payload, new Applicant());
    candidate.job = await this.findJobById(jobId);
    return this.applicantRepository.save(candidate);
  }

  async deleteApplicant(id: string): Promise<SuccessResponse> {
    const applicant = await this.findApplicantById(id);
    await this.applicantRepository.softRemove(applicant);
    return new SuccessResponse(true);
  }
}
