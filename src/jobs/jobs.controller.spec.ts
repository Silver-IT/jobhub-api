import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as Faker from 'faker';
import { repositoryMockFactory } from '../mock/repository.mock';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { Applicant } from './entities/applicant.entity';
import { Job } from './entities/job.entity';
import { SlackModule } from '../slack/slack.module';
import { SlackService } from '../slack/slack.service';
import { SlackMessageType } from '../slack/enums/slack-message-type.enum';

describe('Jobs Controller', () => {
  let controller: JobsController;
  let slackService: SlackService;
  let jobsService: JobsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        SlackModule,
      ],
      controllers: [JobsController],
      providers: [
        JobsService,
        {provide: getRepositoryToken(Job), useFactory: repositoryMockFactory},
        {provide: getRepositoryToken(Applicant), useFactory: repositoryMockFactory}
      ]
    }).compile();

    controller = module.get<JobsController>(JobsController);
    slackService = module.get<SlackService>(SlackService);
    jobsService = module.get<JobsService>(JobsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('applyForJob should send slack message when someone apply for a job', async (done) => {
    const request = {
      email: Faker.name.firstName() + '@email.com',
      fullName: Faker.name.firstName(),
      phone: Faker.phone.phoneNumber(),
      cv: Faker.random.image()
    };
    const jobId = Faker.random.uuid();
    const job = new Applicant();
    jest.spyOn(jobsService, 'applyForJob').mockReturnValue(new Promise((resolve) => { resolve(job)}));
    const spy = jest.spyOn(slackService, 'sendNotification').mockReturnValue(undefined);
    await controller.applyForJob(jobId, request);
    expect(spy).toHaveBeenCalledWith(SlackMessageType.ApplyForJob, job);
    done();
  });
});
