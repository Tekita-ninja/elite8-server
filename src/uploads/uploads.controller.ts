import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('upload')
export class UploadsController {
  constructor(private readonly uploadService: UploadsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        // validators: [new MaxFileSizeValidator({ maxSize: 4000 })],
      }),
    )
    file: Express.Multer.File,
  ) {
    return await this.uploadService.upload(file.originalname, file.buffer);
  }
}
