import { Test, TestingModule } from '@nestjs/testing';
import { JwtHelperServiceImpl } from './jwt-helper.service';
import { JwtHelperService } from '../interface/jwt-helper.service.interface';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWT_HELPER_SERVICE } from '../constants/auth.constants';

jest.mock('uuid', () => ({
  v4: jest.fn((): string => 'mocked-uuid'),
}));

const userId = 1;
const jti = 'mocked-uuid';
const accessExpiry = '15m';
const refreshExpiry = '7d';

describe('JwtHelperService', () => {
  let module: TestingModule;
  let jwtHelperService: JwtHelperService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockJwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockConfigService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'jwtAccessExpiresIn') return accessExpiry;
        if (key === 'jwtRefreshExpiresIn') return refreshExpiry;
        throw new Error('Unknown config key');
      }),
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    mockJwtService = {
      signAsync: jest.fn(),
    } as any;

    (uuidv4 as jest.Mock).mockReturnValue(jti);

    module = await Test.createTestingModule({
      providers: [
        { provide: JWT_HELPER_SERVICE, useClass: JwtHelperServiceImpl },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    jwtHelperService = module.get<JwtHelperService>(JWT_HELPER_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createJwtPayload', () => {
    it('should generate a payload with userId and uuid jti', () => {
      const payload = jwtHelperService.createJwtPayload(userId);
      expect(payload).toEqual({ sub: userId, jti });
    });
  });

  describe('signAccessToken', () => {
    it('should sign an access token with configured expiry', async () => {
      mockJwtService.signAsync.mockResolvedValueOnce('signedAccessToken');

      const token = await jwtHelperService.signAccessToken(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, jti },
        { expiresIn: accessExpiry },
      );
      expect(token).toBe('signedAccessToken');
    });

    it('should throw if signing fails', async () => {
      mockJwtService.signAsync.mockRejectedValueOnce(new Error('sign failed'));
      await expect(jwtHelperService.signAccessToken(userId)).rejects.toThrow(
        'sign failed',
      );
    });
  });

  describe('signRefreshToken', () => {
    it('should sign a refresh token with configured expiry', async () => {
      mockJwtService.signAsync.mockResolvedValueOnce('signedRefreshToken');

      const token = await jwtHelperService.signRefreshToken(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockJwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, jti },
        { expiresIn: refreshExpiry },
      );
      expect(token).toBe('signedRefreshToken');
    });
  });
});
