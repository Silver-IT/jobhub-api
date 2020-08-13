import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';

import { UserRole } from '../../common/enums/user-role.enum';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class UserDto {
  @CreateDateColumn()
  @ApiProperty()
  createdAt: string;

  @UpdateDateColumn()
  @ApiProperty()
  updatedAt: string;

  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  readonly lastName: string;

  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  readonly role: UserRole;

  @ApiProperty()
  @IsBoolean()
  readonly isEmailVerified: boolean;

  @ApiProperty()
  readonly id: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly avatar: string;

  @ApiProperty()
  readonly address: string;
}
