import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/module/app.module';
import { AppConfigurator } from 'src/config/app/app-configurator';
import { ExceptionFilterConfig } from 'src/config/app/exception-filter.config';
import { GlobalPrefixConfig } from 'src/config/app/global-prefox.config';
import { ValidationPipeConfig } from 'src/config/app/validation-pipe.config';

export const createTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();

  const appConfigurator = new AppConfigurator([
    new GlobalPrefixConfig('api/v1'),
    new ValidationPipeConfig(),
    new ExceptionFilterConfig(),
  ]);
  appConfigurator.configure(app);

  await app.init();
  return app;
};
