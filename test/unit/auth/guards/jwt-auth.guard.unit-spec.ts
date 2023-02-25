import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { createMock } from '@golevelup/ts-jest';
import { ConfigModule } from '@nestjs/config';

import { JwtAuthGuard } from '../../../../src/auth/guards/jwt-auth.guard';
import { RedisService } from '../../../../src/redis/redis.service';
import jwtConfig from '../../../../src/common/config/jwt.config';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let redisService: RedisService;
  let jwtService: JwtService;
  let reflector: Reflector;
  let mockExecutionContext: ExecutionContext;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [jwtConfig],
        }),
      ],
      providers: [
        JwtAuthGuard,
        {
          provide: RedisService,
          useValue: createMock<RedisService>(),
        },
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: Reflector,
          useValue: createMock<Reflector>(),
        },
      ],
    }).compile();

    guard = moduleRef.get<JwtAuthGuard>(JwtAuthGuard);
    redisService = moduleRef.get<RedisService>(RedisService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    reflector = moduleRef.get<Reflector>(Reflector);
    mockExecutionContext = createMock<ExecutionContext>();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access to public routes', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });

  it('should not allow access without a token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(guard as any, 'getToken').mockReturnValue(undefined);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      new UnauthorizedException('Authorization token is required'),
    );
  });

  it('should not allow access with an invalid token', async () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    jest.spyOn(guard as any, 'getToken').mockReturnValue('invalid-token');
    jest.spyOn(redisService, 'validate').mockResolvedValue(false);

    await expect(guard.canActivate(mockExecutionContext)).rejects.toThrowError(
      new UnauthorizedException('Authorization token is not valid'),
    );
  });

  it('should allow access with a valid token', async () => {
    const validToken = 'valid-token';
    jest.spyOn(guard as any, 'getToken').mockReturnValue(validToken);
    jest.spyOn(redisService, 'validate').mockResolvedValue(true);

    const result = await guard.canActivate(mockExecutionContext);

    expect(result).toBe(true);
  });
});
