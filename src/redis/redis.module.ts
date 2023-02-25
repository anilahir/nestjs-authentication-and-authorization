import { Global, Module, OnApplicationShutdown, Scope } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ModuleRef } from '@nestjs/core';
import { Redis } from 'ioredis';

import { IORedisKey } from './redis.constants';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: IORedisKey,
      useFactory: async (configService: ConfigService) => {
        return new Redis(configService.get('redis'));
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisService],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(private readonly moduleRef: ModuleRef) {}

  async onApplicationShutdown(signal?: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const redis = this.moduleRef.get(IORedisKey);
      redis.quit();
      redis.on('end', () => {
        resolve();
      });
    });
  }
}
