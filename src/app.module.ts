import { Module } from '@nestjs/common';
import { ItemsModule } from './items/item.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './items/entities/item.entity';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/user.module';
import { User } from './users/entities/user.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        const _redisStore = await redisStore({
          host: 'localhost',
          port: 6379,
        });
        return {
          store: _redisStore,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'todo_api',
      password: 'passwd',
      database: 'todo',
      entities: [Item, User],
      poolSize: 25,
      logging: true,
      cache: {
        type: 'redis',
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    }),
    ItemsModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
