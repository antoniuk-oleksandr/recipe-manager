import { Module } from '@nestjs/common';
import { HealthController } from '../controller/health.controller';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthServiceImpl } from '../service/health.service';
import { DbModule } from 'src/db/module/db.module';

@Module({
  imports: [DbModule],
  controllers: [HealthController],
  providers: [
    {
      provide: HEALTH_SERVICE,
      useClass: HealthServiceImpl,
    },
  ],
})
export class HealthModule {}
