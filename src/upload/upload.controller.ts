import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import * as uuid from 'uuid';
import * as Jimp from 'jimp';

import { ApiFile } from '../common/decorators/api-file.decorator';
import { UploadService } from './upload.service';
import { UploadResponse } from '../common/models/upload';
import { S3Folder } from './enums/s3-folder.enum';

@ApiTags('File Management')
@Controller('api/upload')
export class UploadController {

  constructor(
    private uploadService: UploadService,
  ) {
  }

  @Post('')
  @ApiOkResponse({ type: UploadResponse })
  @ApiConsumes('multipart/form-data')
  @ApiFile()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file): Promise<UploadResponse> {
    return this._upload(file, S3Folder.Files, uuid.v4());
  }

  private async _upload(file, bucket: string, targetFileName: string): Promise<UploadResponse> {
    try {
      const meta = {} as any;
      if (file.originalname.endsWith('.jpg') || file.originalname.endsWith('.png') || file.originalname.endsWith('.jpeg')) {
        const f = await Jimp.read(file.buffer);
        meta.width = `${f.getWidth()}`;
        meta.height = `${f.getHeight()}`;
      }
      const url = await this.uploadService.uploadToS3(file, `${bucket}/${targetFileName}_${file.originalname}`, meta);
      return { url };
    } catch (e) {
      throw new BadRequestException('Failed to upload image');
    }
  }
}
