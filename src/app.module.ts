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
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
        });
        return {
          store: _redisStore,
        };
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'todo_api',
      password: process.env.POSTGRES_PASSWD || 'passwd',
      database: process.env.POSTGRES_DB || 'todo',
      entities: [Item, User],
      poolSize: 25,
      logging: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
      cache: {
        type: 'redis',
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: process.env.REDIS_PORT || 6379,
        },
      },
    }),
    ItemsModule,
    AuthModule,
    UserModule,
  ],
})
export class AppModule {}
