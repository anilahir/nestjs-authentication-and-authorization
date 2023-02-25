import { INestApplication, Type, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Redis } from 'ioredis';
import { getDataSourceToken } from '@nestjs/typeorm';

import { AppModule } from 'src/app.module';
import { TransformInterceptor } from '../../src/common/interceptors/transform.interceptor';
import { IORedisKey } from '../../src/redis/redis.constants';

export class AppFactory {
  private constructor(
    private readonly appInstance: INestApplication,
    private readonly dataSource: DataSource,
    private readonly redis: Redis,
  ) {}

  get instance() {
    return this.appInstance;
  }

  get dbSource() {
    return this.dataSource;
  }

  static async new() {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    const app = module.createNestApplication();

    app.useGlobalInterceptors(new TransformInterceptor());

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidUnknownValues: true,
        stopAtFirstError: true,
        validateCustomDecorators: true,
      }),
    );

    await app.init();

    const dataSource = module.get<DataSource>(
      getDataSourceToken() as Type<DataSource>,
    );

    const redis = module.get<Redis>(IORedisKey);

    return new AppFactory(app, dataSource, redis);
  }

  async close() {
    await this.appInstance.close();
  }

  async cleanupDB() {
    await this.redis.flushall();

    const tables = this.dataSource.manager.connection.entityMetadatas.map(
      (entity) => `${entity.tableName}`,
    );
    for (const table of tables) {
      await this.dataSource.manager.connection.query(`DELETE FROM ${table};`);
    }
  }
}
