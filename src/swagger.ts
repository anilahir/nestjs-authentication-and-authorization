import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import metadata from './metadata';

export const setupSwagger = async (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const swaggerConfig = configService.get('swagger');

  const config = new DocumentBuilder()
    .setTitle(swaggerConfig.docTitle)
    .setDescription(swaggerConfig.docDescription)
    .setVersion(swaggerConfig.docVersion)
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  await SwaggerModule.loadPluginMetadata(metadata);

  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
      // defaultModelsExpandDepth: -1,
    },
    customSiteTitle: swaggerConfig.siteTitle,
  };

  SwaggerModule.setup('docs', app, document, customOptions);
};
