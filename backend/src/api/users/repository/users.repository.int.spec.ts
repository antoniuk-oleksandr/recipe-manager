import { DbService } from 'src/db/service/db.service';
import { UsersRepository } from '../interface/users.repository.interface';
import { UsersRepositoryImpl } from './users.repository';
import { CreateUserDto } from '../domain/dto/create-user.dto';

describe('UsersRepository', () => {
  let dbService: DbService;
  let repo: UsersRepository;

  beforeEach(async () => {
    dbService = new DbService();
    dbService.onModuleInit();

    repo = new UsersRepositoryImpl(dbService);

    await dbService.db.execute('BEGIN');
  });

  afterEach(async () => {
    await dbService.db.execute('ROLLBACK');
    await dbService.onModuleDestroy();
  });

  describe('create', () => {
    it('should create a new user and find it by its id', async () => {
      const userDto: CreateUserDto = {
        email: 'test',
        username: 'test',
        passwordHash: 'test',
      };

      const user = await repo.create(userDto);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user).toMatchObject(userDto);

      const foundUser = await repo.findById(user.id);
      expect(foundUser).toBeDefined();
      expect(foundUser).toMatchObject(userDto);
    });
  });
});
