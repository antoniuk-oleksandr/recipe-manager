import { INestApplication } from '@nestjs/common';
import { AppConfigStep } from './app-config-step';

export class GlobalPrefixConfig implements AppConfigStep {
  constructor(private readonly prefix: string) {}
  configure(app: INestApplication) {
    app.setGlobalPrefix(this.prefix);
  }
}
