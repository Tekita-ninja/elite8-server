import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { SocialsService } from './socials.service';
import { CreateSocialDto } from './dto/create-social.dto';
import { UpdateSocialDto } from './dto/update-social.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('socials')
export class SocialsController {
  constructor(private readonly socialsService: SocialsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createSocialDto: CreateSocialDto) {
    return this.socialsService.create(createSocialDto);
  }

  @Get('all')
  findAll() {
    return this.socialsService.findAll();
  }

  @Get()
  findPaginate(@Query() query: any) {
    return this.socialsService.findPaginate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialDto: UpdateSocialDto) {
    return this.socialsService.update(id, updateSocialDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialsService.remove(id);
  }
}
