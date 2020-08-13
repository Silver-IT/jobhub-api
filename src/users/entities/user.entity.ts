import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { hash } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsString } from 'class-validator';

import { UserRole } from '../../common/enums/user-role.enum';
import { SoftDelete } from '../../common/core/soft-delete';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { Idea } from '../../idea-board/entities/idea.entity';
import { UserDto } from '../../auth/dtos/user.dto';
import { Event } from '../../event/entities/event.entity';
import { CustomerProfile } from './customer-profile.entity';
import { ContractorProfile } from './contractor-profile.entity';
import { InvitationStatus } from '../enums';
import { PatioPackage } from './patio-package.entity';

@Entity('user')
export class User extends SoftDelete {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  @IsString()
  firstName: string;

  @ApiProperty()
  @Column()
  @IsString()
  lastName: string;

  @ApiProperty()
  @Column()
  @IsString()
  phone: string;

  @ApiProperty()
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ enum: UserRole })
  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @OneToMany(() => Event, event => event.user)
  events: Event[];

  @ManyToMany(() => Idea, idea => idea.users)
  @JoinTable()
  ideas: Idea[];

  @OneToOne(() => PatioPackage, patioPackage => patioPackage.user)
  @JoinColumn()
  patioPackage?: PatioPackage;

  @Column()
  @Exclude()
  password: string;

  @Column({ nullable: true, default: null })
  avatar: string;

  @Column({ nullable: true, default: '' })
  address: string;

  @Column('numeric', {
      precision: 20,
      scale: 15,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  latitude: number;

  @Column('numeric', {
      precision: 20,
      scale: 15,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  longitude: number;

  @Column({ nullable: true, default: null })
  stripeCustomerId: string;

  @OneToOne(() => CustomerProfile, customer => customer.user)
  @JoinColumn()
  customerProfile: CustomerProfile;

  @OneToOne(() => ContractorProfile, contractor => contractor.user)
  @JoinColumn()
  contractorProfile: ContractorProfile;

  @Column({ type: 'enum', enum: InvitationStatus, default: InvitationStatus.Pending })
  invitationStatus: InvitationStatus;

  @BeforeInsert()
  preProcess() {
    this.email = this.email.toLowerCase();
    return hash(this.password, 10).then(encrypted => this.password = encrypted);
  }

  toUserDto(): UserDto {
    return {
      id: this.id,
      email: this.email,
      phone: this.phone,
      firstName: this.firstName,
      lastName: this.lastName,
      isEmailVerified: this.isEmailVerified,
      role: this.role,
      avatar: this.avatar,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      address: this.address,
    };
  }
}
