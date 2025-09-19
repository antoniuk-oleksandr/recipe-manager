import { INestApplication } from '@nestjs/common';
import { AppConfigStep } from './app-config-step';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerConfig implements AppConfigStep {
  configure(app: INestApplication): void {
    const config = new DocumentBuilder()
      .setTitle('API Documentation')
      .setDescription('The API description')
      .setVersion('1.0')
      .build();

    const documentFactory = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, documentFactory);
  }
}
