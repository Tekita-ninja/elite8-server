import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { CustomersModule } from './customers/customers.module';
import { QueuePoolsModule } from './queue-pools/queue-pools.module';
import { UtilityModule } from './utility/utility.module';
import { BannersModule } from './banners/banners.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    DbModule,
    CustomersModule,
    QueuePoolsModule,
    UtilityModule,
    BannersModule,
  ],
  providers: [DbModule],
})
export class AppModule {}
