import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as Faker from 'faker';

import { Job } from './entities/job.entity';
import { Applicant } from './entities/applicant.entity';
import { MockType, repositoryMockFactory } from '../mock/repository.mock';
import { JobsService } from './jobs.service';
import { AddJobDto } from './dtos/add-job.dto';
import { JobType, SalaryType } from './enums/job.enum';
import { randomElementArray } from '../common/utils/common.util';

describe('JobsService', () => {
  let service: JobsService;
  let jobRepositoryMock: MockType<Repository<Job>>;
  let jobApplyRepositoryMock: MockType<Repository<Applicant>>;

  const job: AddJobDto = {
    title: Faker.name.jobTitle(),
    description: Faker.name.jobDescriptor(),
    salary: Faker.random.number(70),
    type: JobType.FullTime,
    salaryType: SalaryType.Hourly,
    remote: false,
    hardSkills: randomElementArray(Faker.random.word, String, { min: 3, max: 8 }),
    softSkills: randomElementArray(Faker.random.word, String, { min: 3, max: 8 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: getRepositoryToken(Job), useFactory: repositoryMockFactory },
        { provide: getRepositoryToken(Applicant), useFactory: repositoryMockFactory },
      ],
    }).compile();

    service = module.get<JobsService>(JobsService);
    jobRepositoryMock = module.get(getRepositoryToken(Job));
    jobApplyRepositoryMock = module.get(getRepositoryToken(Applicant));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findJobById should call repository findOne with id but deleted entries should be ignored', () => {
    const uuid = Faker.random.uuid();
    service.findJobById(uuid);
    expect(jobRepositoryMock.findOne).toHaveBeenCalledWith({
      relations: ['applicants'],
      where: { deletedAt: null, id: uuid },
    });
  });

  it('addJob should call repository save with requested data', () => {
    service.addJob(job); // this will test utility functions as well
    expect(jobRepositoryMock.save).toHaveBeenCalledWith(job);
  });

  describe('applyForJob', () => {
    const apply = {
      email: Faker.name.firstName() + '@email.com',
      fullName: Faker.name.firstName(),
      phone: Faker.phone.phoneNumber(),
      cv: Faker.random.image(),
    };

    it('should save proposal to database', async (done) => {
      const fullJob: Job = { ...new Job(), ...job };
      jest.spyOn(service, 'findJobById').mockReturnValue(new Promise((resolve) => {
        resolve(fullJob);
      }));
      await service.applyForJob(Faker.random.uuid(), apply);
      expect(jobApplyRepositoryMock.save).toHaveBeenCalledWith({ ...apply, job: fullJob });
      done();
    });
  });
});
