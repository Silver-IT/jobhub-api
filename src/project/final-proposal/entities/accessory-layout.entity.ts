import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { SoftDelete } from '../../../common/core/soft-delete';
import { ProjectAccessoryType } from '../../enums';
import { AccessoryLayoutDto } from '../dtos/accessory-layout.dto';
import { FinalProposal } from './final-proposal.entity';
import { ImageAttachment } from '../../entities/image-attachment.entity';

@Entity('accessory_layout')
export class AccessoryLayout extends SoftDelete {

  @ManyToOne(() => FinalProposal, proposal => proposal.layouts)
  proposal: FinalProposal;

  @Column({ type: 'enum', enum: ProjectAccessoryType })
  type: ProjectAccessoryType;

  @Column()
  comment: string;

  @OneToMany(() => ImageAttachment, attachment => attachment.accessoryLayout)
  attachments: ImageAttachment[];

  constructor(type?: ProjectAccessoryType, comment?: string, attachments?: ImageAttachment[]) {
    super();
    this.type = type;
    this.comment = comment;
    this.attachments = attachments;
  }

  toDto(): AccessoryLayoutDto {
    return {
      id: this.id,
      type: this.type,
      comment: this.comment,
      attachments: this.attachments.map(attachment => attachment.toDto()),
    };
  }
}
