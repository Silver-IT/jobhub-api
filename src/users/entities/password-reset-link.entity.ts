import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Exclude } from 'class-transformer';
import { resetPasswordLinkExpireHours } from '../../common/constants/general.constants';

@Entity('password_reset_link')
export class PasswordResetLink {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  @IsDate()
  @Exclude()
  expireDate: Date;

  @BeforeInsert()
  updateDate() {
    const expire = new Date();
    expire.setHours(expire.getHours() + resetPasswordLinkExpireHours);
    this.expireDate = expire;
  }

  constructor(email: string) {
    this.email = email;
  }
}
