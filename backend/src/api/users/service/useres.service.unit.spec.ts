/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { UsersRepository } from '../interface/users.repository.interface';
import { UsersService } from '../interface/users.service.interface';
import { UsersServiceImpl } from './users.service';
import { CreateUserDto } from '../domain/dto/create-user.dto';
import { UserAlreadyExistsException } from '../exception/user-already-exists.exception';
import { UserNotFoundException } from '../exception/user-not-found.exception';

describe('UsersService', () => {
  let usersRepository: jest.Mocked<UsersRepository>;
  let usersService: UsersService;

  const createUserDto: CreateUserDto = {
    email: 'test@gmail.com',
    username: 'testuser',
    passwordHash: 'hashedPass',
  };

  const mockUser = {
    id: 1,
    ...createUserDto,
  };

  beforeEach(() => {
    usersRepository = {
      create: jest.fn(),
      findById: jest.fn(),
    };
    usersService = new UsersServiceImpl(usersRepository);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      usersRepository.create.mockResolvedValueOnce(mockUser);

      const result = await usersService.createUser(createUserDto);

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw UserAlreadyExistsException on duplicate email', async () => {
      const pgError = new Error(
        'duplicate key value violates unique constraint',
      ) as any;
      pgError.code = '23505';

      const wrappedError = new Error('Repository error') as any;
      wrappedError.cause = pgError;

      usersRepository.create.mockRejectedValueOnce(wrappedError);

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(
        UserAlreadyExistsException,
      );

      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      expect(usersRepository.create).toHaveBeenCalledWith(createUserDto);
    });

    it('should propagate errors from repository', async () => {
      usersRepository.create.mockRejectedValueOnce(new Error('DB error'));

      await expect(usersService.createUser(createUserDto)).rejects.toThrow(
        'DB error',
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      usersRepository.findById.mockResolvedValueOnce(mockUser);

      const result = await usersService.getUserById(1);

      expect(usersRepository.findById).toHaveBeenCalledTimes(1);
      expect(usersRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockUser);
    });

    it('should throw UserNotFoundException if user is not found', async () => {
      usersRepository.findById.mockResolvedValueOnce(null);

      await expect(usersService.getUserById(123)).rejects.toThrow(
        UserNotFoundException,
      );
      expect(usersRepository.findById).toHaveBeenCalledTimes(1);
      expect(usersRepository.findById).toHaveBeenCalledWith(123);
    });
  });
});
