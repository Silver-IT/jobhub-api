import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class NetworkContractorCategoryDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  published: boolean;
}

export class UpdateNetworkContractorCategoryDto extends NetworkContractorCategoryDto {
  @ApiProperty({ required: true })
  @IsUUID()
  id: string;
}
