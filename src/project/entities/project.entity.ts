import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import {
  CleanupRequiredType,
  DrainageType,
  MachineAccessType,
  OpinionType,
  PreferredColor,
  PreferredPricePoint,
  ProjectAccessoryType,
  ProjectLocationType,
  ProjectShapeType,
  ProjectTimelineType,
  PropertyGradeType,
  SoilType,
} from '../enums';
import { ImageAttachment } from './image-attachment.entity';
import { SoftDelete } from '../../common/core/soft-delete';
import { MaterialType } from '../../idea-board/enums';
import { ProjectAccessory } from './project-accessory.entity';
import { Estimate } from '../estimate/entities/estimate.entity';
import { FinalProposal } from '../final-proposal/entities/final-proposal.entity';
import { Milestone } from './milestone.entity';
import { CustomerProfile } from '../../users/entities/customer-profile.entity';
import { ContractorProfile } from '../../users/entities/contractor-profile.entity';
import { User } from '../../users/entities/user.entity';
import { Chat } from '../../chat/entities/chat.entity';
import { ColumnNumericTransformer } from '../../common/utils/typeorm.util';
import { CustomerVisitHistory } from '../../customer-visit-history/entities/customer-visit-history.entity';
import { Refund } from '../../payment/entities/refund.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { EmailLog } from '../../email/entities/email-status.entity';
import { MaterialRequest } from '../material-request/entities/material-request.entity';
import { MaterialOrderGroup } from '../material-order/entities/material-order-group.entity';

@Entity('project')
export class Project extends SoftDelete {

  @ApiProperty({ type: () => CustomerProfile })
  @ManyToOne(() => CustomerProfile, customer => customer.projects)
  customer: CustomerProfile;

  @ApiProperty({ type: () => ContractorProfile })
  @ManyToOne(() => ContractorProfile, contractor => contractor.projects)
  contractor: ContractorProfile;

  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  address: string;

  @ApiProperty({ required: false })
  @Column('numeric', {
      precision: 20,
      scale: 15,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  latitude: number;

  @ApiProperty({ required: false })
  @Column('numeric', {
      precision: 20,
      scale: 15,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  longitude: number;

  @ApiProperty({ enum: ProjectAccessoryType })
  @Column({ type: 'enum', enum: ProjectAccessoryType })
  projectType: ProjectAccessoryType;

  @ApiProperty({ enum: ProjectLocationType })
  @Column({ type: 'enum', enum: ProjectLocationType })
  locationType: ProjectLocationType;

  @ApiProperty()
  @Column({ default: '' })
  projectSize: string;

  @ApiProperty({ enum: ProjectShapeType })
  @Column({ type: 'enum', enum: ProjectShapeType, nullable: true, default: undefined })
  shapeType: ProjectShapeType;

  @ApiProperty({ type: () => ProjectAccessory, isArray: true })
  @OneToMany(() => ProjectAccessory, accessory => accessory.project)
  accessories: ProjectAccessory[];

  @ApiProperty({ enum: ProjectTimelineType })
  @Column({ type: 'enum', enum: ProjectTimelineType })
  timelineType: ProjectTimelineType;

  @ApiProperty({ enum: OpinionType })
  @Column({ type: 'enum', enum: OpinionType, default: OpinionType.NotSure })
  interestedInFinancing: OpinionType;

  @ApiProperty({ type: Boolean })
  @Column({ type: 'boolean', default: false })
  designRequired: boolean;

  @ApiProperty({ enum: CleanupRequiredType })
  @Column({ type: 'enum', enum: CleanupRequiredType, nullable: true, default: undefined })
  cleanUpType: CleanupRequiredType;

  @ApiProperty({ enum: MaterialType, isArray: true })
  @Column({
    type: 'enum',
    enum: MaterialType,
    array: true,
    default: [],
  })
  materials: MaterialType[];

  @ApiProperty()
  @Column({ default: '' })
  requestDetails: string;

  @ApiProperty()
  @Column('numeric', {
      precision: 17,
      scale: 2,
      transformer: new ColumnNumericTransformer(),
      nullable: true,
      default: undefined,
    },
  )
  budget: number;

  // design details section
  @ApiProperty()
  @Column({ default: '' })
  manufacturer: string;

  @ApiProperty()
  @Column({ default: '' })
  productName: string;

  @ApiProperty()
  @Column({ default: '' })
  preferredSize: string;

  @ApiProperty()
  @Column({ default: '' })
  preferredTexture: string;

  @ApiProperty({ enum: PreferredPricePoint })
  @Column({ type: 'enum', enum: PreferredPricePoint, default: PreferredPricePoint.Economy })
  preferredPricePoint: PreferredPricePoint;

  @ApiProperty({ isArray: true, enum: PreferredColor })
  @Column({ type: 'enum', enum: PreferredColor, array: true, default: [] })
  preferredColors: PreferredColor[];

  @ApiProperty()
  @Column({ default: '' })
  additionalDesigns: string;

  // site details section
  @ApiProperty({ enum: MachineAccessType })
  @Column({ type: 'enum', enum: MachineAccessType })
  machineAccess: MachineAccessType;

  @ApiProperty({ enum: PropertyGradeType })
  @Column({ type: 'enum', enum: PropertyGradeType })
  propertyGrade: PropertyGradeType;

  @ApiProperty({ enum: SoilType })
  @Column({ type: 'enum', enum: SoilType })
  soilType: SoilType;

  @ApiProperty({ enum: DrainageType })
  @Column({ type: 'enum', enum: DrainageType })
  drainageType: DrainageType;

  @ApiProperty()
  @Column({ default: '' })
  exteriorUtilities: string;

  @ApiProperty()
  @Column({ default: '' })
  exteriorHazards: string;

  @ApiProperty()
  @Column({ default: '' })
  exteriorInconveniences: string;

  @ApiProperty()
  @Column({ default: '' })
  materialStorage: string;

  @ApiProperty()
  @Column({ default: '' })
  materialHaulOut: string;

  @ApiProperty()
  @Column({ default: '' })
  downSpouts: string;

  @ApiProperty()
  @Column({ default: '' })
  shrubRemoval: string;

  @ApiProperty({ type: () => ImageAttachment, isArray: true })
  @OneToMany(() => ImageAttachment, attachment => attachment.project)
  attachments: ImageAttachment[];

  @ApiProperty()
  @Column({ default: '' })
  comment: string;

  @OneToOne(() => Estimate, estimate => estimate.project)
  @JoinColumn()
  estimate: Estimate;

  @OneToOne(() => FinalProposal, proposal => proposal.project)
  @JoinColumn()
  finalProposal: FinalProposal;

  @OneToMany(() => Milestone, milestone => milestone.project)
  milestones: Milestone[];

  @OneToOne(() => Chat, chat => chat.project)
  @JoinColumn()
  chat: Chat;

  @Column({ nullable: true, default: undefined })
  contractSignedDate: Date;

  @Column({ default: false })
  estimateSkipped: boolean;

  @Column({ default: false })
  estimateReminderSent: boolean;

  @Column({ default: false })
  governmentConfirmed: boolean;

  @Column({ default: '' })
  governmentCallComment: string;

  @OneToMany(() => CustomerVisitHistory, history => history.project)
  customerVisitHistory: CustomerVisitHistory[];

  @OneToOne(() => Refund, refund => refund.project)
  @JoinColumn()
  refund: Refund;

  @OneToOne(() => Schedule, schedule => schedule.project)
  @JoinColumn()
  pickOutPaverSchedule: Schedule;

  @OneToMany(() => EmailLog, status => status.project)
  emailStatuses: EmailLog[];

  @OneToMany(() => MaterialRequest, materialRequest => materialRequest.project)
  materialRequests: MaterialRequest[];

  @OneToMany(() => MaterialOrderGroup, group => group.project)
  materialOrderGroups: MaterialOrderGroup[];

  user?: User;

  assignedContractor?: User;

  patioPackageProject?: boolean;
}
