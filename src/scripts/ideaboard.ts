import * as dotenv from 'dotenv';
import * as Fs from 'fs';
import * as yargs from 'yargs';
import * as Jimp from 'jimp';

import { UploadService } from '../upload/upload.service';
import { S3Folder } from '../upload/enums/s3-folder.enum';

const targetExtension = '.jpg';
const sourceExtensions = ['.jpg', '.jpeg', '.png'];
const destDirectory = S3Folder.IdeaBoard;

async function getValidIdeaImagePath(filesDirectory: string, i: number): Promise<string> {
  const sourceExtension = sourceExtensions.find(ext => Fs.existsSync(`${filesDirectory}/${i}${ext}`));
  if (!sourceExtension) {
    return null;
  }
  const sourcePath = `${filesDirectory}/${i}${sourceExtension}`;
  if (sourceExtension === targetExtension) {
    return sourcePath;
  }
  const targetPath = `${filesDirectory}/${i}${targetExtension}`;
  const file = await Jimp.read(sourcePath);
  await file.writeAsync(targetPath);
  Fs.unlinkSync(sourcePath);
  return targetPath;
}

async function uploadFiles(filesDirectory: string, numFrom: number, numTo: number): Promise<number> {
  const uploadService = new UploadService();
  let successCount = 0;
  for (let i = numFrom; i <= numTo; i++) {
    const filePath = await getValidIdeaImagePath(filesDirectory, i);
    if (!filePath) {
      continue;
    }
    try {
      const buffer = Fs.readFileSync(filePath);
      const url = await uploadService.uploadToS3WithBuffer(buffer, `${destDirectory}/${i}${targetExtension}`, {});
      console.log(`Idea-board image uploaded: ${url}`);
      successCount++;
    } catch (e) {
      console.log(`Failed to upload: ${filePath}`);
    }
  }
  return successCount;
}

async function start() {
  dotenv.config();
  const argv = yargs.argv;

  if (!argv.directory || !argv.from || !argv.to) {
    console.log('Command line tool to upload the idea-board image files to AWS S3 bucket.\n' +
      'Usage: npm run idea-upload -- --directory=</path/to/idea-board/images/directory> --from=<from-number> --to=<to-number>\n' +
      '    * Please use Unix-like path for the directory argument.\n');
    process.exit(1);
  }
  const filesDirectory = String(argv.directory);
  if (!Fs.existsSync(filesDirectory)) {
    console.log('The directory you provided does not exist.');
    process.exit(1);
  }
  const numFrom = Number(argv.from);
  const numTo = Number(argv.to);
  if (!Boolean(numFrom) || !Boolean(numTo)) {
    console.log('Please provide number for "from" and "to" argument.');
    process.exit(1);
  }
  const successCount = await uploadFiles(filesDirectory, numFrom, numTo);
  console.log(`${successCount} files uploaded.`);
  process.exit();
}

start();
