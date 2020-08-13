import * as Faker from 'faker';

import { JobType, SalaryType } from '../../../jobs/enums/job.enum';
import { randomElementArray } from '../common.util';

function randomSalary(salaryType: SalaryType): number {
  const hourlySalaries = [35, 40, 45, 50, 60, 70, 80, 90, 100, 120];
  const monthlySalaries = [5000, 7000, 10000];
  const annualSalaries = [50000, 60000, 100000, 120000];
  if (salaryType === SalaryType.Hourly) {
    return Faker.random.arrayElement(hourlySalaries);
  } else if (salaryType === SalaryType.Monthly) {
    return Faker.random.arrayElement(monthlySalaries);
  } else if (salaryType === SalaryType.Yearly) {
    return Faker.random.arrayElement(annualSalaries);
  }
}

export function generateJobs(count = 1) {
  const ary = [];
  for (let i = 0; i < count; i++) {
    const salaryType = Faker.random.arrayElement(Object.values(SalaryType));
    ary.push({
      title: Faker.name.jobTitle(),
      description: Faker.lorem.sentence(40),
      type: Faker.random.arrayElement(Object.values(JobType)),
      salary: randomSalary(salaryType),
      salaryType: salaryType,
      remote: Faker.random.boolean(),
      hardSkills: randomElementArray(Faker.random.word, String, { min: 3, max: 8 }),
      softSkills: randomElementArray(Faker.random.word, String, { min: 3, max: 8 }),
      candidates: [],
    });
  }
  return ary;
}

export function generateApplicants(count = 1) {
  const applicants = [];
  for (let i = 0; i < count; i++) {
    const firstName = Faker.name.firstName();
    const lastName = Faker.name.lastName();
    applicants.push({
      email: `applicant${Faker.random.alphaNumeric(5)}.${firstName}@gmail.com`,
      fullName: `${firstName} ${lastName}`,
      phone: Faker.phone.phoneNumber(),
      cv: Faker.internet.url(),
    });
  }
  return applicants;
}

