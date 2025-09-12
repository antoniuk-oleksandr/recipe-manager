import { Module } from '@nestjs/common';
import { AuthController } from '../controller/auth.controller';
import { AuthServiceImpl } from '../service/auth.service';
import {
  AUTH_SERVICE,
  BCRYPT,
  JWT_HELPER_SERVICE,
  PASSWORD_SERVICE,
} from '../constants/auth.constants';
import { UsersModule } from 'src/api/users/module/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PasswordServiceImpl } from '../service/password.service';
import { JwtHelperServiceImpl } from '../service/jwt-helper.service';
import bcrypt from 'bcryptjs';
import { DbModule } from 'src/db/module/db.module';

@Module({
  controllers: [AuthController],
  imports: [
    DbModule,
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('jwtSecret'),
      }),
    }),
  ],
  providers: [
    {
      provide: AUTH_SERVICE,
      useClass: AuthServiceImpl,
    },
    {
      provide: PASSWORD_SERVICE,
      useClass: PasswordServiceImpl,
    },
    {
      provide: JWT_HELPER_SERVICE,
      useClass: JwtHelperServiceImpl,
    },
    {
      provide: BCRYPT,
      useValue: bcrypt,
    },
  ],
})
export class AuthModule {}
