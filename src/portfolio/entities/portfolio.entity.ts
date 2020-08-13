import { Column, Entity } from 'typeorm';

import { SoftDelete } from '../../common/core/soft-delete';
import { MaterialType } from '../../idea-board/enums';
import { PortfolioDto } from '../dtos/portfolio.dto';

@Entity('portfolio')
export class Portfolio extends SoftDelete {
  @Column({ default: '' })
  name: string;

  @Column({ type: 'enum', enum: MaterialType, array: true })
  materials: MaterialType[];

  @Column({ default: '' })
  address: string;

  @Column({ default: '' })
  email: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  comment: string;

  toDto(): PortfolioDto {
    return {
      name: this.name,
      address: this.address,
      email: this.email,
      materials: this.materials,
      phone: this.phone,
      comment: this.comment,
    };
  }
}
