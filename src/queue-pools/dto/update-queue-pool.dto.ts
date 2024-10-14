import { PartialType } from '@nestjs/mapped-types';
import { CreateQueuePoolDto } from './create-queue-pool.dto';

export class UpdateQueuePoolDto extends PartialType(CreateQueuePoolDto) {}
