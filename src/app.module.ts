import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { CustomersModule } from './customers/customers.module';
import { QueuePoolsModule } from './queue-pools/queue-pools.module';
import { UtilityModule } from './utility/utility.module';
import { BannersModule } from './banners/banners.module';
import { VisitHistoryModule } from './visit-history/visit-history.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    DbModule,
    CustomersModule,
    QueuePoolsModule,
    UtilityModule,
    BannersModule,
    VisitHistoryModule,
  ],
  providers: [DbModule],
})
export class AppModule {}
