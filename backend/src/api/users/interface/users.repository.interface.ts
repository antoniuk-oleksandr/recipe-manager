import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserEntity } from '../domain/entity/user.entity';

export interface UsersRepository {
  findById(id: number): Promise<UserEntity | null>;
  create(user: CreateUserDto): Promise<UserEntity>;
  findByUsernameOrEmail(usernameOrEmail: string): Promise<UserEntity | null>;
}
