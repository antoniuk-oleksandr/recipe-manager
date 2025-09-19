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

  describe('findByUsernameOrEmail', () => {
    it('should return a found user when searching by its username', async () => {
      const userDto: CreateUserDto = {
        email: 'test@gmail.com',
        username: 'test',
        passwordHash: 'test',
      };

      const user = await repo.create(userDto);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user).toMatchObject(userDto);

      const foundUser = await repo.findByUsernameOrEmail(userDto.username);
      expect(foundUser).toBeDefined();
      expect(foundUser).toMatchObject(userDto);
    });

    it('should return a found user when searching by its email', async () => {
      const userDto: CreateUserDto = {
        email: 'test@gmail.com',
        username: 'test',
        passwordHash: 'test',
      };

      const user = await repo.create(userDto);

      expect(user).toBeDefined();
      expect(user.id).toBeDefined();
      expect(user).toMatchObject(userDto);

      const foundUser = await repo.findByUsernameOrEmail(userDto.email);
      expect(foundUser).toBeDefined();
      expect(foundUser).toMatchObject(userDto);
    });
  });

  it('should return null if user not found', async () => {
    const foundUser = await repo.findByUsernameOrEmail('test');
    expect(foundUser).toBeNull();
  });
});
