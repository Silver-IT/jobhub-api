import { Injectable } from '@nestjs/common';
import * as Faker from 'faker';

import { UsersService } from '../users/users.service';
import { JobsService } from '../jobs/jobs.service';
import { IdeaBoardService } from '../idea-board/idea-board.service';
import {
  generateAccount,
  generateContractorAccount,
  generateCustomerAccount,
  generateDefaultAdminAccounts,
  generateSuperAdminAccounts,
} from '../common/utils/seed/user-seed.util';
import { generateApplicants, generateJobs } from '../common/utils/seed/job-seed.util';
import { getDummyIdeas } from '../common/utils/seed/idea-board-seed.util';
import { generateProject } from '../common/utils/seed/project-seed.util';
import { ProjectService } from '../project/project.service';
import { randomElementArray } from '../common/utils/common.util';
import { Project } from '../project/entities/project.entity';
import { NetworkContractorService } from '../network-contractor/network-contractor.service';
import {
  generateNetworkCategories,
  generateNetworkContractors,
} from '../common/utils/seed/network-contractor-seed.util';
import { getFromDto } from '../common/utils/repository.util';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class SeedService {

  constructor(
    private readonly userService: UsersService,
    private readonly jobService: JobsService,
    private readonly ideaBoardService: IdeaBoardService,
    private readonly projectService: ProjectService,
    private readonly networkContractorService: NetworkContractorService,
  ) {
  }

  async startDevelopmentSeed() {
    await this.seedUsers();
    await this.seedJobs();
    await this.seedIdeaBoard();
    await this.seedNetworkContractor();
  }

  async startProductionSeed() {
    const admins = generateDefaultAdminAccounts();
    await Promise.all(admins.map(async generated => {
      const user = await this.userService.findUserByEmail(generated.email);
      if (!user) {
        const newUser = await this.userService.addUser(generated);
        await this.userService.verifyEmail(newUser.id);
      }
    }));
    await this.seedIdeaBoard();
  }

  async seedUsers() {
    const userCount = await this.userService.count();
    if (userCount !== 0) {
      return;
    }
    let seedCustomerCount = 5;
    // contractor
    const adminAndContractors = [...generateSuperAdminAccounts(), ...generateContractorAccount(1), generateAccount('captainsuper328@gmail.com', 'hong', 'lin', '1231231234', UserRole.SuperAdmin)];
    await Promise.all(adminAndContractors.map(async admin => {
      const user = await this.userService.addUser(admin);
      await this.userService.verifyEmail(user.id);
    }));

    // customer
    const customerCount = await this.userService.customerCount();
    if (customerCount >= seedCustomerCount) {
      return;
    }
    seedCustomerCount = seedCustomerCount - customerCount;
    generateCustomerAccount(seedCustomerCount).forEach(async account => {
      const user = await this.userService.addUser(account, [], false);
      await this.userService.verifyEmail(user.id);
      const projects = randomElementArray(generateProject, Project, { min: 3, max: 5 });
      projects.forEach(project => project.customer = user.customerProfile);
      await this.projectService.addFullProjects(projects);
    });
  }

  async seedJobs() {
    let seedJobCount = 5;
    const jobCount = await this.jobService.jobCount();
    if (jobCount >= seedJobCount) {
      return;
    }
    seedJobCount = seedJobCount - jobCount;
    generateJobs(seedJobCount).forEach(async job => {
      const applicantCount = Faker.random.number({ min: 2, max: 5 });
      const applicants = await this.jobService.addJobApplicants(generateApplicants(applicantCount));
      await this.jobService.addJob(job, applicants);
    });
  }

  async seedIdeaBoard() {
    const ideaCount = await this.ideaBoardService.count();
    const ideas = getDummyIdeas();
    if (ideas.length > ideaCount) {
      await this.ideaBoardService.bulkAdd(ideas.slice(ideaCount));
    }
    const allIdeas = await this.ideaBoardService.find(0, ideas.length);
    if (!allIdeas[0].width) {
      await this.ideaBoardService.bulkAdd(allIdeas.map((idea, index) => getFromDto(ideas[index], idea)));
    }
  }

  async seedNetworkContractor() {
    const seedContractorCount = 5;
    let [categories] = await this.networkContractorService.categories(0, 100);
    if (categories.length === 0) {
      categories = await this.networkContractorService.addCategories(generateNetworkCategories());
    }
    const networkContractorCount = await this.networkContractorService.count();
    if (networkContractorCount < seedContractorCount) {
      await this.networkContractorService.addMany(generateNetworkContractors(categories, seedContractorCount));
    }
  }
}
