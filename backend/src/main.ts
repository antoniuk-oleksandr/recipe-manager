import { ConfigService } from '@nestjs/config';
import { AppModule } from './app/module/app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { AppConfigurator } from './config/app/app-configurator';
import { GlobalPrefixConfig } from './config/app/global-prefox.config';
import { ValidationPipeConfig } from './config/app/validation-pipe.config';
import { ExceptionFilterConfig } from './config/app/exception-filter.config';
import { SwaggerConfig } from './config/app/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const appConfigurator = new AppConfigurator([
    new GlobalPrefixConfig('api/v1'),
    new ValidationPipeConfig(),
    new ExceptionFilterConfig(),
    new SwaggerConfig(),
  ]);

  appConfigurator.configure(app);

  const configService = app.get(ConfigService);
  const port = configService.getOrThrow<number>('port');

  await app.listen(port, '0.0.0.0');
}

bootstrap();
