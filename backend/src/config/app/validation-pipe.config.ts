import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppConfigStep } from './app-config-step';

export class ValidationPipeConfig implements AppConfigStep {
  configure(app: INestApplication) {
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
  }
}
