import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';
import { JobType, SalaryType } from '../enums/job.enum';

export class AddJobDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @ApiProperty({enum: JobType})
  @IsEnum(JobType)
  readonly type: JobType;

  @ApiProperty({type: Number})
  @IsNumber()
  @Min(1)
  readonly salary: number;

  @ApiProperty({enum: SalaryType})
  @IsEnum(SalaryType)
  readonly salaryType: SalaryType;

  @ApiProperty({type: Boolean})
  @IsBoolean()
  @IsNotEmpty()
  readonly remote: boolean;

  @ApiProperty({type: String, isArray: true})
  @IsArray()
  readonly hardSkills: string[];

  @ApiProperty({type: String, isArray: true})
  @IsArray()
  readonly softSkills: string[];
}
