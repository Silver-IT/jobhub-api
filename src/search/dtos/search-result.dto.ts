import { ApiProperty } from '@nestjs/swagger';

import { Project } from '../../project/entities/project.entity';
import { UserDto } from '../../auth/dtos/user.dto';
import { NetworkContractor } from '../../network-contractor/entities/network-contractor.entity';

export class SearchResultDto {

  @ApiProperty({ type: Project, isArray: true })
  projects: Project[];

  @ApiProperty({ type: UserDto, isArray: true })
  customers: UserDto[];

  @ApiProperty({ type: UserDto, isArray: true })
  contractors: UserDto[];

  @ApiProperty({ type: NetworkContractor, isArray: true })
  networkContractors: NetworkContractor[];

  constructor() {
    this.projects = [];
    this.customers = [];
    this.contractors = [];
    this.networkContractors = [];
  }
}
