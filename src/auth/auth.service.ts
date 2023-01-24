import { Injectable } from '@nestjs/common';

import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@Injectable()
export class AuthService {
  signUp(signUpDto: SignUpDto) {
    return 'This action sign up the user and return the jwt token';
  }

  signIn(signInDto: SignInDto) {
    return 'This action sign in the user and return the jwt token';
  }
}
