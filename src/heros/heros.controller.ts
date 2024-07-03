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
import { HerosService } from './heros.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('heros')
export class HerosController {
  constructor(private readonly herosService: HerosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHeroDto: CreateHeroDto) {
    return this.herosService.create(createHeroDto);
  }

  @Get('all')
  findAll() {
    return this.herosService.findAll();
  }

  @Get()
  findPaginate(@Query() query: any) {
    return this.herosService.findPaginate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.herosService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.herosService.update(id, updateHeroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.herosService.remove(id);
  }
}
