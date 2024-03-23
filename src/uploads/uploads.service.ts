import {
  PutObjectCommand,
  S3Client,
  GetObjectAclCommand,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadsService {
  private readonly s3Client = new S3Client({
    region: this.configServe.getOrThrow('AWS_S3_REGION'),
    credentials: {
      accessKeyId: this.configServe.getOrThrow('AWS_ACCESS_KEY'),
      secretAccessKey: this.configServe.getOrThrow('AWS_SECRET_ACCESS_KEY'),
    },
  });
  constructor(private readonly configServe: ConfigService) {}
  async upload(fileName: string, file: Buffer) {
    try {
      const response = await this.s3Client.send(
        new PutObjectCommand({
          Bucket: 'koselani',
          Key: fileName,
          Body: file,
        }),
      );
      return {
        status: response.$metadata.httpStatusCode,
        message: 'success upload file',
        filename: fileName,
      };
    } catch (error) {
      throw new BadRequestException('failed upload file');
    }
  }

  async uploads(files: Array<Express.Multer.File>) {
    try {
      const responses = Promise.all(
        files.map((file: Express.Multer.File) => {
          return this.s3Client.send(
            new PutObjectCommand({
              Bucket: 'koselani',
              Key: file.filename,
              Body: file.buffer,
            }),
          );
        }),
      );
      return (await responses).length;
    } catch (error) {
      return error;
    }
  }

  async get(fileName: string) {
    const response = await this.s3Client.send(
      new GetObjectAclCommand({
        Bucket: 'koselani',
        Key: fileName,
      }),
    );
    return {
      fileName,
      response,
    };
  }
  catch(error) {
    return error;
  }
}
