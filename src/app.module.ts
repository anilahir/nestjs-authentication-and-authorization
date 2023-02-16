import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import appConfig from './common/config/app.config';
import databaseConfig from './common/config/database.config';
import jwtConfig from './common/config/jwt.config';
import { validate } from './common/validation/env.validation';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import redisConfig from './common/config/redis.config';
import { RedisModule } from './redis/redis.module';
import swaggerConfig from './common/config/swagger.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, databaseConfig, redisConfig, swaggerConfig],
      validate,
    }),
    DatabaseModule,
    RedisModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
