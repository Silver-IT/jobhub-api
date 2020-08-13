import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../../common/enums/user-role.enum';
import { SourceFoundUs } from '../../common/enums/source-found-us.enum';
import { Lead } from '../../lead/entities/lead.entity';
import { splitName } from '../../common/utils/string.util';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ required: false })
  address?: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ required: false })
  password?: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  ideas: string[];
}

export class RegisterUserDto extends CreateUserDto {
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole;

  @ApiProperty({ enum: SourceFoundUs, required: false })
  @IsOptional()
  sourceFoundUs?: SourceFoundUs;

  static fromLead(lead: Lead): RegisterUserDto {
    const dto = new RegisterUserDto();
    dto.role = UserRole.Customer;
    dto.sourceFoundUs = lead.sourceFoundUs;
    dto.email = lead.email;
    [dto.firstName, dto.lastName] = splitName(lead.fullName);
    dto.phone = lead.phone;
    dto.ideas = [];
    dto.address = lead.address;
    dto.latitude = lead.latitude;
    dto.longitude = lead.longitude;
    dto.password = '';
    return dto;
  }
}
