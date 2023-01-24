import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Match } from '../../common/decorators/match.decorator';

export class SignUpDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'password too short',
  })
  @MaxLength(20, {
    message: 'password too long',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password too weak',
  })
  readonly password: string;

  @Match('password')
  @IsNotEmpty()
  readonly passwordConfirm: string;
}
