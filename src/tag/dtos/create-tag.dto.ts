import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

import { TagCategory } from '../enums/tag.enum';

export class CreateTagDto {

  @ApiProperty({ enum: TagCategory })
  @IsEnum(TagCategory)
  category: TagCategory;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  text: string;
}
