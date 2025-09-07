import { Module } from '@nestjs/common';
import { HealthController } from '../controller/health.controller';
import { DbService } from 'src/db/service/db.service';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthServiceImpl } from '../service/health.service';

@Module({
  controllers: [HealthController],
  providers: [
    DbService,
    {
      provide: HEALTH_SERVICE,
      useClass: HealthServiceImpl,
    },
  ],
})
export class HealthModule {}
