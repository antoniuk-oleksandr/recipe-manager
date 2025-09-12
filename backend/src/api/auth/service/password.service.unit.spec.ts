import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from '../interface/password.service.interface';
import { BCRYPT, PASSWORD_SERVICE } from '../constants/auth.constants';
import { PasswordServiceImpl } from './password.service';
import { ConfigService } from '@nestjs/config';

type BcryptMock = {
  hash: jest.Mock<Promise<string>, [string]>;
  compare: jest.Mock<Promise<boolean>, [string, string]>;
};

describe('PasswordService', () => {
  let module: TestingModule;
  let service: PasswordService;
  let bcryptMock: jest.Mocked<BcryptMock>;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: ConfigService,
          useValue: { getOrThrow: jest.fn().mockReturnValue(10) },
        },
        { provide: PASSWORD_SERVICE, useClass: PasswordServiceImpl },
        { provide: BCRYPT, useValue: { hash: jest.fn(), compare: jest.fn() } },
      ],
    }).compile();

    service = module.get<PasswordService>(PASSWORD_SERVICE);
    bcryptMock = module.get(BCRYPT);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('hash', () => {
    it('should hash the password', async () => {
      bcryptMock.hash.mockResolvedValueOnce('myCustomHash');
      const hash = await service.hash('myPassword');

      expect(hash).toBe('myCustomHash');
      expect(bcryptMock.hash).toHaveBeenCalledWith('myPassword', 10);
    });

    it('should throw if bcrypt.hash fails', async () => {
      bcryptMock.hash.mockRejectedValueOnce(new Error('bcrypt error'));
      await expect(service.hash('pass')).rejects.toThrow('bcrypt error');
    });
  });

  describe('compare', () => {
    it('should return true for matching passwords', async () => {
      bcryptMock.compare.mockResolvedValueOnce(true);
      const isMatch = await service.compare('myPassword', 'hashedPassword');

      expect(isMatch).toBe(true);
      expect(bcryptMock.compare).toHaveBeenCalledWith(
        'myPassword',
        'hashedPassword',
      );
    });

    it('should return false for non-matching passwords', async () => {
      bcryptMock.compare.mockResolvedValueOnce(false);
      const isMatch = await service.compare('wrongPass', 'hashedPassword');

      expect(isMatch).toBe(false);
    });
  });
});
