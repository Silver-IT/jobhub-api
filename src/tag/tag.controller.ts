import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TagService } from './tag.service';
import { TagQueryDto } from './dtos/tag-query.dto';
import { TagCategory } from './enums/tag.enum';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dtos/create-tag.dto';

@ApiBearerAuth()
@ApiTags('Tag')
@UseGuards(JwtAuthGuard)
@Controller('api/tag')
export class TagController {

  constructor(
    private tagService: TagService
  ) {
  }

  @Get('find/:category')
  @ApiImplicitParam({ name: 'category', required: true })
  @ApiOkResponse({ type: String, isArray: true })
  async findTags(@Query() query: TagQueryDto, @Param('category') category: TagCategory): Promise<string[]> {
    const res = await this.tagService.findByKeyword(query.keyword || '', category, query.count);
    return res.map(x => x.text);
  }

  @Post()
  @ApiOkResponse({ type: Tag })
  addTag(@Body() body: CreateTagDto): Promise<Tag> {
    return this.tagService.addTag(body);
  }
}
