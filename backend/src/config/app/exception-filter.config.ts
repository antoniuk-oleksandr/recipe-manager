import { INestApplication } from '@nestjs/common';
import { AppConfigStep } from './app-config-step';
import { DefaultExceptionFilter } from 'src/exception-filter/default-exception.filter';

export class ExceptionFilterConfig implements AppConfigStep {
  configure(app: INestApplication): void {
    app.useGlobalFilters(new DefaultExceptionFilter());
  }
}
