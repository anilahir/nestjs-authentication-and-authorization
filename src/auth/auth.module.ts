import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { BcryptService } from './bcrypt.service';
import { User } from '../users/entities/user.entitiy';
import jwtConfig from '../common/config/jwt.config';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    RedisModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, BcryptService],
  exports: [JwtModule],
})
export class AuthModule {}
