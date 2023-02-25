import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../src/users/entities/user.entity';
import { UsersService } from '../../../src/users/users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getMe', () => {
    it('should return a user with the specified ID', async () => {
      const userId = '123';
      const user = new User();
      user.id = userId;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.getMe(userId);

      expect(result).toEqual(user);
    });

    it('should throw a BadRequestException if user is not found', async () => {
      const userId = '123';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(usersService.getMe(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
