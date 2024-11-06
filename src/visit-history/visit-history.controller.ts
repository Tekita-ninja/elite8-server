import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VisitHistoryService } from './visit-history.service';
import { CreateVisitHistoryDto } from './dto/create-visit-history.dto';
import { UpdateVisitHistoryDto } from './dto/update-visit-history.dto';

@Controller('visit-history')
export class VisitHistoryController {
  constructor(private readonly visitHistoryService: VisitHistoryService) {}

  @Post()
  create(@Body() createVisitHistoryDto: CreateVisitHistoryDto) {
    return this.visitHistoryService.create(createVisitHistoryDto);
  }

  @Get()
  findAll() {
    return this.visitHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.visitHistoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVisitHistoryDto: UpdateVisitHistoryDto) {
    return this.visitHistoryService.update(+id, updateVisitHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.visitHistoryService.remove(+id);
  }
}
