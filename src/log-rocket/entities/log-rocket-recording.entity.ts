import { Column, Entity } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { SoftDelete } from '../../common/core/soft-delete';

@Entity('log_rocket_recording')
export class LogRocketRecording extends SoftDelete {

  @ApiProperty()
  @Column()
  recordingId: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true })
  email: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true })
  firstName: string;

  @ApiProperty({ required: false })
  @Column({ default: null, nullable: true })
  lastName: string;

  @ApiProperty({ type: Boolean })
  @Column({ default: false })
  isResolved: boolean;

  toDto(isUpdate: boolean) {
    return {
      ...this,
      isUpdate
    };
  }
}
