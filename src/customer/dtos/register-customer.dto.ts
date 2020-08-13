import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { RegisterProjectDto } from '../../project/dtos/register-project.dto';
import { CreateUserDto } from '../../users/dtos/create-user.dto';
import { PatioPackageDto } from '../../users/dtos/patio-package.dto';
import { SourceFoundUs } from '../../common/enums/source-found-us.enum';

export class RegisterCustomerDto {

  @ApiProperty({ type: [RegisterProjectDto] })
  @Type(() => RegisterProjectDto)
  @ValidateNested({ each: true })
  projects: RegisterProjectDto[];

  @ApiProperty({ type: () => PatioPackageDto, required: false })
  @Type(() => PatioPackageDto)
  @ValidateNested()
  patioPackage?: PatioPackageDto;

  @ApiProperty({ type: CreateUserDto })
  @Type(() => CreateUserDto)
  @ValidateNested()
  user: CreateUserDto;

  @ApiProperty({ enum: SourceFoundUs, required: false })
  @IsOptional()
  sourceFoundUs?: SourceFoundUs;

}
