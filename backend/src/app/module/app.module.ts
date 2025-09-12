import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/api/auth/module/auth.module';
import { HealthModule } from 'src/api/health/module/health.module';
import { UsersModule } from 'src/api/users/module/users.module';
import appConfig from 'src/config/app/app.config';
import { DbModule } from 'src/db/module/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    DbModule,
    HealthModule,
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
