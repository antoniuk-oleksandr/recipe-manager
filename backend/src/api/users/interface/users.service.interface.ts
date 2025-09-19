import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserEntity } from '../domain/entity/user.entity';

export interface UsersService {
  getUserById(id: number): Promise<UserEntity>;
  createUser(user: CreateUserDto): Promise<UserEntity>;
  getUserByUsernameOrEmail(usernameOrEmail: string): Promise<UserEntity | null>;
}
