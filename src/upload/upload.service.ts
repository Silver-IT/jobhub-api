import { Injectable } from '@nestjs/common';
import * as aws from 'aws-sdk';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const s3 = new aws.S3();

@Injectable()
export class UploadService {

  uploadToS3(file: any, path: string, meta): Promise<string> {
    return this.uploadToS3WithBuffer(file.buffer, path, meta);
  }

  uploadToS3WithBuffer(buffer: Buffer, path: string, meta: any): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      s3.putObject({ Body: buffer, Bucket: process.env.AWS_S3_BUCKET_NAME, Key: path, Metadata: meta })
        .promise()
        .then(() => resolve(`${process.env.STORAGE_HOST}${path}`), error => reject(error));
    });
  }

  s3Copy(src: string, dst: string): Promise<string> {
    return new Promise<string>(resolve => {
      s3.copyObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        CopySource: `${process.env.AWS_S3_BUCKET_NAME}/${src}`,
        Key: dst,
      }, err => {
        if (err) {
          resolve(null);
        } else {
          resolve(dst);
        }
      });
    });
  }

  s3Remove(dst: string): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      s3.deleteObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: dst }, err => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  metaData(key: string): Promise<any> {
    return new Promise<any>(resolve => {
      s3.headObject({ Bucket: process.env.AWS_S3_BUCKET_NAME, Key: key }, function(err, data) {
        if (err) {
          resolve({});
        } else {
          resolve(data.Metadata);
        }
      });
    });
  }
}
