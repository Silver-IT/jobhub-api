import { Body, Controller, Delete, Get, Headers, Param, Post, Put, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ApiImplicitParam } from '@nestjs/swagger/dist/decorators/api-implicit-param.decorator';
import { JwtService } from '@nestjs/jwt';

import { IdeaBoardService } from './idea-board.service';
import { ideaBoardDefaultTakeCount } from '../common/constants/general.constants';
import { AllIdeaBoardQueryDto, IdeaBoardQueryDto } from './dtos/idea-board-query.dto';
import { SuccessResponse } from '../common/models/success-response';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { UpdateIdeaBoardDto } from './dtos/create-idea-board.dto';
import { IdeaDto } from './dtos/idea.dto';
import { Idea } from './entities/idea.entity';
import { IdeaBoardBlockQueryDto } from './dtos/idea-board-block-query.dto';
import { UsersService } from '../users/users.service';
import { BulkAddIdeaDto } from './dtos/bulk-add-idea.dto';
import { getFromDto } from '../common/utils/repository.util';
import { UploadService } from '../upload/upload.service';
import { S3Folder } from '../upload/enums/s3-folder.enum';

@ApiTags('Idea Board')
@Controller('api/idea-board')
export class IdeaBoardController {

  constructor(
    private jwtService: JwtService,
    private ideaBoardService: IdeaBoardService,
    private userService: UsersService,
    private uploadService: UploadService,
  ) {
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @ApiOkResponse({ type: IdeaDto, isArray: true })
  async getIdeaBoardItems(@Request() request, @Query() query: IdeaBoardQueryDto): Promise<IdeaDto[]> {
    const ideas = await this.ideaBoardService.getAllIdeaBoardItemsByUserId(request.user.id, query.projectType, query.materialType);
    return ideas.map(idea => idea.toDto());
  }

  @Get('as-block')
  @ApiOkResponse({ type: IdeaDto, isArray: true })
  async getIdeaBoardItemsAsBlock(@Query() query: IdeaBoardBlockQueryDto): Promise<IdeaDto[]> {
    const ideas = await this.ideaBoardService.getIdeaBoardItemsAsBlock(query.projectType, query.count);
    return ideas.map(idea => idea.toDto());
  }

  @Get('customer/:userId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiImplicitParam({ name: 'userId', required: true })
  @ApiOkResponse({ type: IdeaDto, isArray: true })
  async getIdeaBoardItemsByCustomerId(@Param('userId') userId, @Query() query: AllIdeaBoardQueryDto): Promise<IdeaDto[]> {
    const ideas = await this.ideaBoardService.getAllIdeaBoardItemsByUserId(userId, query.projectType, query.materialType);
    return ideas.map(idea => idea.toDto());
  }

  @Post(':id/like')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @ApiImplicitParam({ name: 'id', required: true })
  async setLike(@Request() request, @Param('id') id: string): Promise<SuccessResponse> {
    const idea = await this.ideaBoardService.findById(id);
    await this.userService.addLike(request.user.id, idea);
    return new SuccessResponse(true);
  }

  @Post(':id/dislike')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Customer])
  @ApiImplicitParam({ name: 'id', required: true })
  async setDislike(@Request() request, @Param('id') id: string): Promise<SuccessResponse> {
    const idea = await this.ideaBoardService.findById(id);
    await this.userService.removeLike(request.user.id, idea);
    return new SuccessResponse(true);
  }

  @Get('all')
  @ApiOkResponse({ type: IdeaDto, isArray: true })
  async getAllIdeaBoardItems(@Headers('authorization') authorization: string, @Query() query: IdeaBoardQueryDto): Promise<IdeaDto[]> {
    let userIdeas = null;
    if (authorization) {
      const jwt = authorization.substr(7);
      const decoded = this.jwtService.decode(jwt) as any;
      if (decoded) {
        userIdeas = await this.ideaBoardService.getIdeaBoardItemsByUserId(decoded.id, 0, -1, null, null);
      }
    }
    const ideas = await this.ideaBoardService.getAllIdeaBoardItems(query.skip || 0, query.take || ideaBoardDefaultTakeCount, query.projectType, query.materialType);
    return ideas.map(idea => {
      const dto = idea.toDto();
      dto.selected = !!(userIdeas && userIdeas.find(userIdea => userIdea.id === idea.id));
      return dto;
    });
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.SuperAdmin])
  @ApiOkResponse({ type: Idea, isArray: true })
  async add(@Body() body: BulkAddIdeaDto): Promise<Idea[]> {
    const availableNumber = await this.ideaBoardService.availableNumber();
    const ideas = await Promise.all(body.files.map(async (idea, i) => {
      const newIdea = getFromDto<Idea>(idea, new Idea());
      newIdea.indexNumber = availableNumber + i;
      const url = idea.url;
      const key = url.substr(process.env.STORAGE_HOST.length);
      const ext = url.substr(url.lastIndexOf('.'));
      const meta = await this.uploadService.metaData(key);
      newIdea.width = +meta.width;
      newIdea.height = +meta.height;
      const dst = `${S3Folder.IdeaBoard}/${newIdea.indexNumber}${ext}`;
      const res = await this.uploadService.s3Copy(key, `${S3Folder.IdeaBoard}/${newIdea.indexNumber}${ext}`);
      await this.uploadService.s3Remove(key);
      newIdea.url = `${process.env.STORAGE_HOST}${dst}`;
      if (!res) {
        return null;
      }
      return newIdea;
    }));
    return this.ideaBoardService.bulkAdd(ideas);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: Idea })
  update(@Param('id') id, @Body() body: UpdateIdeaBoardDto): Promise<Idea> {
    return this.ideaBoardService.updateIdeaBoardItem(id, body);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiImplicitParam({ name: 'id', required: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles([UserRole.Contractor])
  @ApiOkResponse({ type: SuccessResponse })
  deleteIdea(@Param('id') id): Promise<SuccessResponse> {
    return this.ideaBoardService.deleteIdeaBoardItem(id);
  }
}
