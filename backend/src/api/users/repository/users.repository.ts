import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/service/db.service';
import { UsersRepository } from '../interface/users.repository.interface';
import { eq } from 'drizzle-orm';
import { usersTable } from 'src/db/tables/users';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserEntity } from '../domain/entity/user.entity';
import { getTableColumns } from 'drizzle-orm';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  constructor(private readonly dbService: DbService) {}

  async create(user: CreateUserDto): Promise<UserEntity> {
    const [createdUser] = await this.dbService.db
      .insert(usersTable)
      .values(user)
      .returning();

    return new UserEntity(createdUser);
  }

  async findById(id: number): Promise<UserEntity | null> {
    const users = await this.dbService.db
      .select(getTableColumns(usersTable))
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    const user = users[0];
    return user ? new UserEntity(user) : null;
  }
}
