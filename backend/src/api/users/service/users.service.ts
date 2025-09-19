/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Inject, Injectable } from '@nestjs/common';
import type { UsersRepository } from '../interface/users.repository.interface';
import { UsersService } from '../interface/users.service.interface';
import { UserNotFoundException } from '../exception/user-not-found.exception';
import { USERS_REPOSITORY } from '../constants/users.constants';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserEntity } from '../domain/entity/user.entity';
import { UserAlreadyExistsException } from '../exception/user-already-exists.exception';

@Injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    @Inject(USERS_REPOSITORY)
    private readonly usersRepository: UsersRepository,
  ) {}

  getUserByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserEntity | null> {
    return this.usersRepository.findByUsernameOrEmail(usernameOrEmail);
  }

  async createUser(user: CreateUserDto): Promise<UserEntity> {
    try {
      return await this.usersRepository.create(user);
    } catch (error: any) {
      const pgError = error?.cause;

      if (pgError?.code === '23505') {
        throw new UserAlreadyExistsException();
      }

      throw error;
    }
  }

  async getUserById(id: number): Promise<UserEntity> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }
}
