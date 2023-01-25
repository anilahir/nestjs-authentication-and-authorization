import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entitiy';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getMe(userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }
}
