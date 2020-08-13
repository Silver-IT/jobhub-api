import { ApiProperty } from '@nestjs/swagger';
import { ScheduleStatus, ScheduleType } from '../enums';
import { Project } from '../../project/entities/project.entity';
import { User } from '../../users/entities/user.entity';
import { PatioPackageDto } from '../../users/dtos/patio-package.dto';
import { UserDto } from '../../auth/dtos/user.dto';
import { ProjectDto } from '../../project/dtos/register-project.dto';

class ScheduleData {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: () => UserDto })
  user: User;

  @ApiProperty({ type: () => ProjectDto })
  project?: Project;

  @ApiProperty({ type: () => PatioPackageDto })
  patioPackage?: PatioPackageDto;
}

export class ScheduleDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ enum: ScheduleType })
  type: ScheduleType;

  @ApiProperty()
  from: Date;

  @ApiProperty()
  to: Date;

  @ApiProperty({ enum: ScheduleType, required: false })
  status?: ScheduleStatus;

  @ApiProperty({ type: () => ScheduleData })
  data: ScheduleData;
}
