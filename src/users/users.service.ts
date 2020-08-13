import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from '@nestjs/common/utils/is-uuid';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { RegisterUserDto } from './dtos/create-user.dto';
import { SuccessResponse } from '../common/models/success-response';
import { PasswordResetLink } from './entities/password-reset-link.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { Idea } from '../idea-board/entities/idea.entity';
import { getFromDto, saveDtoToRepository } from '../common/utils/repository.util';
import { CustomerProfile } from './entities/customer-profile.entity';
import { ContractorProfile } from './entities/contractor-profile.entity';
import { CustomerDto } from './dtos/customer.dto';
import { InvitationStatus } from './enums';
import { PatioPackage } from './entities/patio-package.entity';
import { PatioPackageDto } from './dtos/patio-package.dto';
import { EmailChangeLink } from './entities/change-email-link.entity';

@Injectable()
export class UsersService {
  [x: string]: any;

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(PasswordResetLink)
    private readonly passwordResetLinksRepository: Repository<PasswordResetLink>,
    @InjectRepository(CustomerProfile)
    private readonly customerRepository: Repository<CustomerProfile>,
    @InjectRepository(ContractorProfile)
    private readonly contractorRepository: Repository<ContractorProfile>,
    @InjectRepository(PatioPackage)
    private patioPackageRepository: Repository<PatioPackage>,
    @InjectRepository(EmailChangeLink)
    private changeEmailLinkRepository: Repository<EmailChangeLink>,
  ) {
  }

  async addUser(body: RegisterUserDto, ideas?: Idea[], throwError = true): Promise<User> {
    const found = await this.findUserByEmail(body.email);
    if (found) {
      if (throwError) {
        throw new BadRequestException(`Email is already taken.`);
      } else {
        return found;
      }
    }
    const user = getFromDto<User>(body, new User());
    if (ideas) {
      user.ideas = ideas;
    }
    if (body.role === UserRole.Customer) {
      const profile = new CustomerProfile();
      profile.sourceFoundUs = body.sourceFoundUs;
      user.customerProfile = await this.customerRepository.save(profile);
    } else if (body.role === UserRole.Contractor || body.role === UserRole.SuperAdmin) {
      user.contractorProfile = await this.contractorRepository.save(new ContractorProfile());
    }
    return this.usersRepository.save(user);
  }

  findUserByEmail(email: string, findRemoved = false): Promise<User> {
    if (!email) {
      return null;
    }
    return this.usersRepository.findOne({
      withDeleted: findRemoved,
      relations: ['ideas', 'customerProfile', 'contractorProfile', 'patioPackage'],
      where: { email: email.toLowerCase() },
    });
  }

  findUserById(id: string, findRemoved = false): Promise<User> {
    return this.usersRepository.findOne({
      withDeleted: findRemoved,
      relations: ['customerProfile', 'contractorProfile', 'patioPackage'],
      where: { id },
    });
  }

  findEmailChangeLinkById(id: string): Promise<EmailChangeLink> {
    return this.changeEmailLinkRepository.findOne({ id });
  }

  async deleteEmailChangeLink(link: EmailChangeLink): Promise<SuccessResponse> {
    await this.changeEmailLinkRepository.remove(link);
    return new SuccessResponse(true);
  }

  findResetLinkByToken(resetToken: string): Promise<PasswordResetLink | undefined> {
    if (!isUUID(resetToken)) {
      throw new BadRequestException('Password reset token is invalid.');
    }
    return this.passwordResetLinksRepository.findOne({ id: resetToken });
  }

  async findCustomers(skip: number, take: number): Promise<[CustomerDto[], number]> {

    const [customers, count] = await this.customerRepository.findAndCount({
      relations: ['user', 'user.ideas', 'projects'],
      skip, take,
      order: {
        createdAt: 'DESC',
      },
    });

    return [customers.map(customer => customer.toDto()), count];
  }

  addChangeEmailLink(from: string, to: string): Promise<EmailChangeLink> {
    return this.changeEmailLinkRepository.save(new EmailChangeLink(from, to));
  }

  async findContractors(): Promise<User[]> {
    const contractors = await this.contractorRepository.find({ relations: ['user'] });
    return contractors.sort((a, b) => a.user.createdAt > b.user.createdAt ? 1 : -1).map(contractor => contractor.user);
  }

  findUsersByKeyword(keyword: string): Promise<User[]> {
    return this.usersRepository.createQueryBuilder('user')
      .where('LOWER(user.firstName) like :keyword', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(user.lastName) like :keyword', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(user.email) like :keyword', { keyword: '%' + keyword + '%' })
      .orWhere('LOWER(user.phone) like :keyword', { keyword: '%' + keyword + '%' })
      .getMany();
  }

  async findContractorProfiles(): Promise<ContractorProfile[]> {
    return this.contractorRepository.find();
  }

  async findContractorProfileByUserId(id: string): Promise<ContractorProfile> {
    return this.contractorRepository.createQueryBuilder('contractor_profile')
      .leftJoinAndSelect('contractor_profile.user', 'user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async findSuperAdmins(): Promise<User[]> {
    return this.usersRepository.find({
      role: UserRole.SuperAdmin,
    });
  }

  async findCustomerById(id: string): Promise<CustomerDto> {

    const user = await this.usersRepository.findOne({
      relations: ['customerProfile'],
      where: { id },
    });
    const customer = await this.customerRepository.findOne({
      relations: ['user', 'user.ideas', 'projects'],
      where: { id: user.customerProfile.id },
    });
    return customer.toDto();
  }

  async addLike(id: string, idea: Idea) {
    const user = await this.usersRepository.findOne({
      relations: ['ideas'],
      where: { id },
    });
    user.ideas.push(idea);
    await this.usersRepository.save(user);
  }

  async removeLike(id: string, idea: Idea) {
    const user = await this.usersRepository.findOne({
      relations: ['ideas'],
      where: { id },
    });
    const index = user.ideas.findIndex(i => i.id === idea.id);
    user.ideas.splice(index, 1);
    await this.usersRepository.save(user);
  }

  async updateUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async setInvitationStatus(user: User, status: InvitationStatus): Promise<User> {
    user.invitationStatus = status;
    return this.usersRepository.save(user);
  }

  async changePassword(email: string, password: string): Promise<SuccessResponse> {
    const user: User = await this.usersRepository.findOne({ email: email });
    if (!user) {
      throw new BadRequestException(`${user.email} is not a registered account.`);
    }
    user.password = password;
    await user.preProcess();
    await this.usersRepository.save(user);
    await this.passwordResetLinksRepository.delete({ email: email });
    return { success: true };
  }

  customerCount(): Promise<number> {
    return this.usersRepository.count({ role: UserRole.Customer });
  }

  async verifyEmail(uuid: string): Promise<SuccessResponse> {
    if (!isUUID(uuid)) {
      throw new BadRequestException('Verification url is not valid.');
    }
    const user = await this.usersRepository.findOne({ id: uuid });
    if (!user) {
      throw new BadRequestException('Verification url is not valid.');
    }
    user.isEmailVerified = true;
    user.invitationStatus = InvitationStatus.Accepted; // email verification is only in self customer register
    await this.usersRepository.save(user);
    return { success: true };
  }

  async getResetPasswordToken(email: string): Promise<string> {
    await this.passwordResetLinksRepository.delete({ email: email });
    const passwordResetLink = new PasswordResetLink(email);
    const link = await this.passwordResetLinksRepository.save(passwordResetLink);
    return link.id;
  }

  async remove(id: string): Promise<SuccessResponse> {
    const user = await this.findUserById(id);
    if (!user) {
      throw new BadRequestException('The requested user does not exist.');
    }
    await this.usersRepository.softDelete({ id });
    await this.contractorRepository.softDelete({ id: user.contractorProfile.id });
    return new SuccessResponse(true);
  }

  async removePatioPackages(patioPackage: PatioPackage): Promise<SuccessResponse> {
    await this.patioPackageRepository.softRemove(patioPackage);
    return new SuccessResponse(true);
  }

  async savePatioPackage(dto: PatioPackageDto): Promise<PatioPackage> {
    return saveDtoToRepository<PatioPackage>(dto, new PatioPackage(), this.patioPackageRepository);
  }

  count(): Promise<number> {
    return this.usersRepository.count();
  }
}
