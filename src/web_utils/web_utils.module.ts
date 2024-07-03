import { Module } from '@nestjs/common';
import { WebUtilsService } from './web_utils.service';
import { WebUtilsController } from './web_utils.controller';

@Module({
  controllers: [WebUtilsController],
  providers: [WebUtilsService],
})
export class WebUtilsModule {}
