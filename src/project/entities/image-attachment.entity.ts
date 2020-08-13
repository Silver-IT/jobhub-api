import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { Project } from './project.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { FinalProposal } from '../final-proposal/entities/final-proposal.entity';
import { Estimate } from '../estimate/entities/estimate.entity';
import { ImageAttachmentDto } from '../dtos/image-attachment.dto';
import { AccessoryLayout } from '../final-proposal/entities/accessory-layout.entity';

@Entity('image_attachment')
export class ImageAttachment extends SoftDelete {

  @ManyToOne(() => Project, project => project.attachments)
  project: Project;

  @ManyToOne(() => FinalProposal, proposal => proposal.attachments)
  proposal: FinalProposal;

  @ManyToOne(() => Estimate, estimate => estimate.sketches)
  estimate: Estimate;

  @ManyToOne(() => AccessoryLayout, layout => layout.attachments)
  accessoryLayout: AccessoryLayout;

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  url: string;

  constructor(url?: string) {
    super();
    this.url = url;
  }

  toDto(): ImageAttachmentDto {
    return {
      id: this.id,
      url: this.url,
    };
  }
}
