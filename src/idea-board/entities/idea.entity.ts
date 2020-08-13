import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';
import { User } from '../../users/entities/user.entity';
import { ProjectAccessoryType } from '../../project/enums';
import { MaterialType } from '../enums';
import { IdeaDto } from '../dtos/idea.dto';

@Entity('idea')
export class Idea extends SoftDelete {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  indexNumber: number;

  @ApiProperty()
  @Column()
  url: string;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  width: number;

  @ApiProperty()
  @Column({ nullable: true, default: undefined })
  height: number;

  @ManyToMany(() => User, user => user.ideas)
  users: User[];

  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  projectType: ProjectAccessoryType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @Column({
    type: 'enum',
    enum: MaterialType,
    array: true,
  })
  materialTypes: MaterialType[];

  toDto(): IdeaDto {
    return {
      id: this.id,
      url: this.url,
      width: this.width,
      height: this.height,
      selected: false,
      projectType: this.projectType,
      materialTypes: this.materialTypes,
    };
  }
}
