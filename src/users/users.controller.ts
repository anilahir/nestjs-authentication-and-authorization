import { Controller, Get } from '@nestjs/common';
import { ActiveUser } from '../common/decorators/active-user.decorator';

import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@ActiveUser('id') userId: string) {
    return this.usersService.getMe(userId);
  }
}
