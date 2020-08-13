import { ApiProperty } from '@nestjs/swagger';

export class AcceptProposalDto {
  @ApiProperty({ type: [String] })
  acceptedItems: string[];
}
