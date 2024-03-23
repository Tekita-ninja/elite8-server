import { Module } from '@nestjs/common';
import { HerosService } from './heros.service';
import { HerosController } from './heros.controller';

@Module({
  controllers: [HerosController],
  providers: [HerosService],
})
export class HerosModule {}
