import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import appConfig from 'src/config/app.config';
import { DbModule } from 'src/db/module/db.module';

@Module({
  imports: [
    DbModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
  ],
})
export class AppModule {}
