import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, JwtStrategy],
})
export class CategoriesModule {}
