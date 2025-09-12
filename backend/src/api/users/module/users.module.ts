import { Module } from '@nestjs/common';
import { UsersServiceImpl } from '../service/users.service';
import { UsersRepositoryImpl } from '../repository/users.repository';
import { UsersController } from '../controller/users.controller';
import { USERS_REPOSITORY, USERS_SERVICE } from '../constants/users.constants';
import { DbModule } from 'src/db/module/db.module';

@Module({
  imports: [DbModule],
  providers: [
    {
      provide: USERS_SERVICE,
      useClass: UsersServiceImpl,
    },
    {
      provide: USERS_REPOSITORY,
      useClass: UsersRepositoryImpl,
    },
  ],
  controllers: [UsersController],
  exports: [USERS_SERVICE, USERS_REPOSITORY],
})
export class UsersModule {}
