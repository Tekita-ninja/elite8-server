import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { customFileName } from 'src/utils/files';
import { UploadsService } from './uploads.service';
@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (_, file, cb) => {
        file.filename = customFileName(file.originalname);
        cb(null, true);
      },
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        // validators: [new MaxFileSizeValidator({ maxSize: 4000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.upload(file.filename, file.buffer);
  }

  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    const newFiles = files.map((file: Express.Multer.File) => {
      file.filename = customFileName(file.originalname);
      return file;
    });
    const response = await this.uploadService.uploads(newFiles);
    if (response && response > 0) {
      const images = newFiles.map((item: Express.Multer.File) => {
        return {
          path: item.filename,
        };
      });

      return images;
    }
  }
}
