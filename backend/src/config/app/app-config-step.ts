import { INestApplication } from '@nestjs/common';

export interface AppConfigStep {
  configure(app: INestApplication): void;
}
