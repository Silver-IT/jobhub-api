import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class NetworkContractorDto {

  @ApiProperty()
  id: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  contacts: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  website: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  serviceDescription: string;

  @ApiProperty()
  @IsUUID()
  category: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  logoUrl: string;
}
