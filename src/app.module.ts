import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, CategoriesModule],
  providers: [PrismaService],
})
export class AppModule {}
