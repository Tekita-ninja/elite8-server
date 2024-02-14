import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { HerosService } from './heros.service';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';

@Controller('heros')
export class HerosController {
  constructor(private readonly herosService: HerosService) {}

  @Post()
  create(@Body() createHeroDto: CreateHeroDto) {
    return this.herosService.create(createHeroDto);
  }

  @Get()
  findAll() {
    return this.herosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.herosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHeroDto: UpdateHeroDto) {
    return this.herosService.update(id, updateHeroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.herosService.remove(id);
  }
}
