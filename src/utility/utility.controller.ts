import {
  Body,
  Controller,
  Get,
  HttpCode,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUtilityDto } from './dto/create-utility.dto';
import { UtilityService } from './utility.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
// import { customFileName } from 'src/utils/files';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('utility')
@UseGuards(JwtAuthGuard)
export class UtilityController {
  constructor(private readonly utilityService: UtilityService) {}

  @Post()
  @HttpCode(200)
  create(@Body() createUtilityDto: CreateUtilityDto) {
    return this.utilityService.create(createUtilityDto);
  }

  @Get('summary')
  summary() {
    return this.utilityService.summary();
  }
  @Get()
  find() {
    return this.utilityService.find();
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Folder tempat file disimpan
        filename: (req, file, cb) => {
          // Menentukan nama file yang unik menggunakan tanggal
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname); // Mendapatkan ekstensi file
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      // fileFilter: (_, file, cb) => {
      //   file.filename = customFileName(file.originalname);
      //   cb(null, true);
      // },
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
    return await this.utilityService.upload(file.filename, file.buffer);
  }
}
