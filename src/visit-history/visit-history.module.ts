import { Module } from '@nestjs/common';
import { VisitHistoryService } from './visit-history.service';
import { VisitHistoryController } from './visit-history.controller';

@Module({
  controllers: [VisitHistoryController],
  providers: [VisitHistoryService],
})
export class VisitHistoryModule {}
