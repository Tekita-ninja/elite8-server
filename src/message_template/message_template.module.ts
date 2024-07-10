import { Module } from '@nestjs/common';
import { MessageTemplateService } from './message_template.service';
import { MessageTemplateController } from './message_template.controller';

@Module({
  controllers: [MessageTemplateController],
  providers: [MessageTemplateService],
})
export class MessageTemplateModule {}
