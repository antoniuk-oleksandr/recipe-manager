import { Test } from '@nestjs/testing';
import { UsersRepository } from '../interface/users.repository.interface';
import { UsersRepositoryImpl } from './users.repository';
import { DbService } from 'src/db/service/db.service';
import { USERS_REPOSITORY } from '../constants/users.constants';

const createMockDb = (rows: any[]) => ({
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue(rows),
});

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let mockDbService: jest.Mocked<DbService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: USERS_REPOSITORY, useClass: UsersRepositoryImpl },
        DbService,
      ],
    }).compile();

    usersRepository = module.get<UsersRepository>(USERS_REPOSITORY);
    mockDbService = module.get(DbService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a UserEntity when a user exists in the database', async () => {
      Object.defineProperty(mockDbService, 'db', {
        get: () =>
          createMockDb([
            {
              id: 123,
              email: 'test@gmail.com',
              passwordHash: 'hashedPassword',
            },
          ]),
      });

      const result = await usersRepository.findById(123);

      expect(result).toMatchObject({
        id: 123,
        email: 'test@gmail.com',
        passwordHash: 'hashedPassword',
      });
    });

    it('should return null when no user exists for the given id', async () => {
      Object.defineProperty(mockDbService, 'db', {
        get: () => createMockDb([]),
      });

      const result = await usersRepository.findById(123);

      expect(result).toBeNull();
    });
  });
});
