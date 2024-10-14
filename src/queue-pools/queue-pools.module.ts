import { Module } from '@nestjs/common';
import { QueuePoolsService } from './queue-pools.service';
import { QueuePoolsController } from './queue-pools.controller';
import { CustomersService } from 'src/customers/customers.service';

@Module({
  controllers: [QueuePoolsController],
  providers: [QueuePoolsService, CustomersService],
})
export class QueuePoolsModule {}
