import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { Redis } from 'ioredis';

import { IORedisKey } from '../../../src/redis/redis.constants';
import { RedisService } from '../../../src/redis/redis.service';

describe('RedisService', () => {
  let redisService: RedisService;
  let redisClient: Redis;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: IORedisKey,
          useValue: createMock<Redis>(),
        },
      ],
    }).compile();

    redisService = moduleRef.get<RedisService>(RedisService);
    redisClient = moduleRef.get<Redis>(IORedisKey);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call redisClient.keys with the provided pattern when getKeys is called', async () => {
    const pattern = 'test*';
    const expectedKeys = ['test1', 'test2'];
    (redisClient.keys as any).mockResolvedValue(expectedKeys);

    const result = await redisService.getKeys(pattern);

    expect(redisClient.keys).toHaveBeenCalledWith(pattern);
    expect(result).toEqual(expectedKeys);
  });

  it('should call redisClient.set with the provided key and value when insert is called', async () => {
    const key = 'test-key';
    const value = 'test-value';

    await redisService.insert(key, value);

    expect(redisClient.set).toHaveBeenCalledWith(key, value);
  });

  it('should call redisClient.get with the provided key when get is called', async () => {
    const key = 'test-key';
    const expectedValue = 'test-value';
    (redisClient.get as any).mockResolvedValue(expectedValue);

    const result = await redisService.get(key);

    expect(redisClient.get).toHaveBeenCalledWith(key);
    expect(result).toEqual(expectedValue);
  });

  it('should call redisClient.del with the provided key when delete is called', async () => {
    const key = 'test-key';

    await redisService.delete(key);

    expect(redisClient.del).toHaveBeenCalledWith(key);
  });

  it('should return true if the stored value matches the provided value when validate is called', async () => {
    const key = 'test-key';
    const value = 'test-value';
    (redisClient.get as any).mockResolvedValue(value);

    const result = await redisService.validate(key, value);

    expect(redisClient.get).toHaveBeenCalledWith(key);
    expect(result).toBe(true);
  });

  it('should return false if the stored value does not match the provided value when validate is called', async () => {
    const key = 'test-key';
    const value = 'test-value';
    (redisClient.get as any).mockResolvedValue('other-value');

    const result = await redisService.validate(key, value);

    expect(redisClient.get).toHaveBeenCalledWith(key);
    expect(result).toBe(false);
  });
});
