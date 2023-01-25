import { Redis } from 'ioredis';

import {
  Inject,
  Injectable,
  OnApplicationShutdown,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import redisConfig from '../common/config/redis.config';

@Injectable()
export class RedisService implements OnApplicationShutdown, OnModuleInit {
  private redisClient: Redis;

  constructor(
    @Inject(redisConfig.KEY)
    private readonly redisConfiguration: ConfigType<typeof redisConfig>,
  ) {}

  async onModuleInit() {
    this.redisClient = new Redis(this.redisConfiguration);
  }

  async onApplicationShutdown(signal?: string) {
    await this.redisClient.quit();
  }

  async getKeys(pattern?: string): Promise<string[]> {
    return await this.redisClient.keys(pattern);
  }

  async insert(key: string, value: string | number): Promise<void> {
    await this.redisClient.set(key, value);
  }

  async get(key: string): Promise<string> {
    return this.redisClient.get(key);
  }

  async delete(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async validate(key: string, value: string): Promise<boolean> {
    const storedValue = await this.redisClient.get(key);
    return storedValue === value;
  }
}
