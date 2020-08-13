import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { EmailType } from '../../common/enums/email.type';
import { Project } from '../../project/entities/project.entity';

@Entity('email_log')
export class EmailLog extends SoftDelete {
  @ApiProperty({ enum: EmailType })
  @Column({ type: 'enum', enum: EmailType })
  type: EmailType;

  @ApiProperty()
  @Column()
  xMessageId: string;

  @ApiProperty()
  @Column()
  email: string;

  @ApiProperty()
  @Column()
  subject: string;

  @ManyToOne(() => Project, project => project.emailStatuses)
  project: Project;
}
