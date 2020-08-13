import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Tag } from './entities/tag.entity';
import { TagCategory } from './enums/tag.enum';
import { CreateTagDto } from './dtos/create-tag.dto';

@Injectable()
export class TagService {

  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>
  ) {
  }

  async findByKeyword(keyword: string, category: TagCategory, count = 10): Promise<Tag[]> {
    return this.tagRepository.createQueryBuilder('tag')
      .where('LOWER(tag.text) like LOWER(:keyword)', { keyword: '%' + keyword + '%' })
      .andWhere('tag.category = :category', { category })
      .getMany();
  }

  async findByText(text: string, category: TagCategory): Promise<Tag> {
    return this.tagRepository.findOne({ text, category });
  }

  async addTag(tag: CreateTagDto): Promise<Tag> {
    const found = await this.findByText(tag.text, tag.category);
    if (found) {
      return found;
    } else {
      const newTag = new Tag();
      newTag.text = tag.text;
      newTag.category = tag.category;
      return this.tagRepository.save(newTag);
    }
  }

  async bulkAdd(category: TagCategory, values: string[]): Promise<Tag[]> {
    values = values.filter(v => v);
    return Promise.all(values.map(text => this.addTag({ category, text })));
  }
}
