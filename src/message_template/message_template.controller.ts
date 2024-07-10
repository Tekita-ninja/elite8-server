import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { MessageTemplateService } from './message_template.service';
import { CreateMessageTemplateDto } from './dto/create-message_template.dto';
import { UpdateMessageTemplateDto } from './dto/update-message_template.dto';

@Controller('message-template')
export class MessageTemplateController {
  constructor(
    private readonly messageTemplateService: MessageTemplateService,
  ) {}

  @Post()
  create(@Body() createMessageTemplateDto: CreateMessageTemplateDto) {
    return this.messageTemplateService.create(createMessageTemplateDto);
  }

  @Get('all')
  findAll() {
    return this.messageTemplateService.findAll();
  }
  @Get()
  findPaginate(@Query() query: any) {
    return this.messageTemplateService.findPaginate(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.messageTemplateService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMessageTemplateDto: UpdateMessageTemplateDto,
  ) {
    return this.messageTemplateService.update(id, updateMessageTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.messageTemplateService.remove(id);
  }
}
