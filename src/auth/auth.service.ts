import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { BcryptService } from './bcrypt.service';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

type User = {
  id: string;
  email: string;
  password: string;
};

@Injectable()
export class AuthService {
  private users: User[] = [];

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;

    const hashedPassword = await this.bcryptService.hash(password);

    const user = {
      id: randomUUID(),
      email,
      password: hashedPassword,
    };

    this.users.push(user);
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = this.users.find((user) => user.email === email);
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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        expiresIn: 3600,
        secret: 'super-secret',
      },
    );

    return { accessToken };
  }
}
