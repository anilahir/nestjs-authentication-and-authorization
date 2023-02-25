import { DataSource, EntityManager } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../../src/users/entities/user.entity';

export class UserFactory {
  private dataSource: DataSource;

  static new(dataSource: DataSource) {
    const factory = new UserFactory();
    factory.dataSource = dataSource;
    return factory;
  }

  async create(user: Partial<User> = {}) {
    const userRepository = this.dataSource.getRepository(User);
    const salt = await bcrypt.genSalt();
    const password = await this.hashPassword(user.password, salt);
    const payload = {
      ...user,
      password,
    };
    return userRepository.save(payload);
  }

  private hashPassword(password: string, salt: string) {
    return bcrypt.hash(password, salt);
  }
}
