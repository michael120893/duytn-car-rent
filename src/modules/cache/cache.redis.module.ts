import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { REDIS_HOST, REDIS_PORT } from 'src/enviroments';
import { CacheRedisService } from './cache.redis.service';
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        store: redisStore,
        host: REDIS_HOST,
        port: REDIS_PORT,
        username: 'car-rent', // new property
      password: 'qejkdl6WTeoslHeUDGQ0EQzVTLaEUhA4', // new property
      no_ready_check: true, // new property
      }),
    }),
  ],
  providers: [CacheRedisService],
  exports: [CacheRedisService],
})
export class CacheRedisModule {}
