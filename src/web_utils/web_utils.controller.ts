import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateWebUtilDto } from './dto/create-web_util.dto';
import { WebUtilsService } from './web_utils.service';

@Controller('web-utils')
export class WebUtilsController {
  constructor(private readonly webUtilsService: WebUtilsService) {}

  @Post()
  create(@Body() createWebUtilDto: CreateWebUtilDto) {
    return this.webUtilsService.create(createWebUtilDto);
  }

  @Get()
  findUtils() {
    return this.webUtilsService.findUtils();
  }
}
