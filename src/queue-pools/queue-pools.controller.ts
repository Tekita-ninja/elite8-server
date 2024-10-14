import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { QueuePoolsService } from './queue-pools.service';
import { CreateQueuePoolDto } from './dto/create-queue-pool.dto';
import { UpdateQueuePoolDto } from './dto/update-queue-pool.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('queue-pools')
export class QueuePoolsController {
  constructor(private readonly queuePoolsService: QueuePoolsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createQueuePoolDto: CreateQueuePoolDto) {
    return this.queuePoolsService.create(createQueuePoolDto);
  }
  @Get('last-num')
  getLastNumberWaiting() {
    return this.queuePoolsService.getLastNumberWaiting();
  }
  @Get('cl')
  findForClient() {
    return this.queuePoolsService.findAll({
      status: 'WAITING',
    });
  }

  @Get('list')
  findList() {
    return this.queuePoolsService.findList();
  }
  @Get('all')
  findAll() {
    return this.queuePoolsService.findAll();
  }

  @Get()
  findPaginate(@Query() query: any) {
    return this.queuePoolsService.findPaginate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.queuePoolsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQueuePoolDto: UpdateQueuePoolDto,
  ) {
    return this.queuePoolsService.update(id, updateQueuePoolDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.queuePoolsService.remove(id);
  }
  @UseGuards(JwtAuthGuard)
  @Post('call')
  @HttpCode(200)
  async call(@Body('queueId') queueId: string) {
    const data = await this.queuePoolsService.findOne(queueId);
    this.queuePoolsService.update(queueId, {
      numOfCall: data.numOfCall + 1,
      status: data.numOfCall >= 4 ? 'REMOVED' : 'WAITING',
    });
    return data;
  }
}
