import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('email_change_link')
export class EmailChangeLink {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  from: string;

  @ApiProperty()
  @Column()
  to: string;

  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}
