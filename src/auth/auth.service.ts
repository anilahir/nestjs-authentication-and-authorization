import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';

import jwtConfig from '../common/config/jwt.config';
import { MysqlErrorCode } from '../common/enums/error-codes.enum';
import { ActiveUserData } from '../common/interfaces/active-user-data.interface';
import { RedisService } from '../redis/redis.service';
import { User } from '../users/entities/user.entity';
import { BcryptService } from './bcrypt.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly redisService: RedisService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<void> {
    const { email, password } = signUpDto;

    try {
      const user = new User();
      user.email = email;
      user.password = await this.bcryptService.hash(password);
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === MysqlErrorCode.UniqueViolation) {
        throw new ConflictException(`User [${email}] already exist`);
      }
      throw error;
    }
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid email');
    }

    const isPasswordMatch = await this.bcryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid password');
    }

    return await this.generateAccessToken(user);
  }

  async signOut(userId: string): Promise<void> {
    this.redisService.delete(`user-${userId}`);
  }

  async generateAccessToken(
    user: Partial<User>,
  ): Promise<{ accessToken: string }> {
    const tokenId = randomUUID();

    await this.redisService.insert(`user-${user.id}`, tokenId);

    const accessToken = await this.jwtService.signAsync(
      {
        id: user.id,
        email: user.email,
        tokenId,
      } as ActiveUserData,
      {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      },
    );

    return { accessToken };
  }
}
