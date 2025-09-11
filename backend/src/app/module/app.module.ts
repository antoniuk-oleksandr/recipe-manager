import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from 'src/api/health/module/health.module';
import appConfig from 'src/config/app/app.config';
import { DbModule } from 'src/db/module/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    DbModule,
    HealthModule,
  ],
})
export class AppModule {}
