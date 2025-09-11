import { INestApplication } from '@nestjs/common';
import { AppConfigStep } from './app-config-step';

export class AppConfigurator {
  constructor(private readonly steps: AppConfigStep[]) {}

  configure(app: INestApplication) {
    for (const step of this.steps) {
      step.configure(app);
    }
  }
}
