/* eslint-disable @typescript-eslint/unbound-method */
import { Test } from '@nestjs/testing';
import {
  AUTH_SERVICE,
  JWT_HELPER_SERVICE,
  PASSWORD_SERVICE,
} from '../constants/auth.constants';
import { AuthServiceImpl } from './auth.service';
import { USERS_SERVICE } from 'src/api/users/constants/users.constants';
import { PasswordService } from '../interface/password.service.interface';
import { JwtHelperService } from '../interface/jwt-helper.service.interface';
import { AuthService } from '../interface/auth.service.interface';
import { UsersService } from 'src/api/users/interface/users.service.interface';
import { LoginDto } from '../domain/dto/login.dto';
import { InvalidCredentialsException } from '../exception/invalid-credentials.exception';

const mockUsersService: jest.Mocked<UsersService> = {
  getUserById: jest.fn(),
  createUser: jest.fn(),
  getUserByUsernameOrEmail: jest.fn(),
};

const mockPasswordService: jest.Mocked<PasswordService> = {
  hash: jest.fn(),
  compare: jest.fn(),
};

const mockJwtHelperService: jest.Mocked<JwtHelperService> = {
  createJwtPayload: jest.fn(),
  signAccessToken: jest.fn(),
  signRefreshToken: jest.fn(),
};

const userFixture = {
  id: 1,
  email: 'test@gmail.com',
  username: 'testuser',
  passwordHash: 'hashedPassword',
};

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        { provide: AUTH_SERVICE, useClass: AuthServiceImpl },
        { provide: USERS_SERVICE, useValue: mockUsersService },
        { provide: PASSWORD_SERVICE, useValue: mockPasswordService },
        { provide: JWT_HELPER_SERVICE, useValue: mockJwtHelperService },
      ],
    }).compile();

    authService = module.get<AuthService>(AUTH_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should hash password, create user, and return access & refresh tokens', async () => {
      mockPasswordService.hash.mockResolvedValueOnce('hashedPassword');
      mockUsersService.createUser.mockResolvedValueOnce(userFixture);
      mockJwtHelperService.createJwtPayload.mockReturnValueOnce({
        jti: 'test',
        sub: 1,
      });
      mockJwtHelperService.signAccessToken.mockResolvedValueOnce('accessToken');
      mockJwtHelperService.signRefreshToken.mockResolvedValueOnce(
        'refreshToken',
      );

      const registerDto = {
        email: userFixture.email,
        username: userFixture.username,
        password: 'password',
      };

      const jwtDto = await authService.registerUser(registerDto);

      expect(jwtDto).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });

      expect(mockPasswordService.hash).toHaveBeenCalledWith('password');
      expect(mockUsersService.createUser).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        passwordHash: 'hashedPassword',
      });
      expect(mockJwtHelperService.signAccessToken).toHaveBeenCalled();
      expect(mockJwtHelperService.signRefreshToken).toHaveBeenCalled();
    });
  });

  describe('loginUser', () => {
    it('should validate user credentials and return access & refresh tokens', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValueOnce(
        userFixture,
      );

      mockPasswordService.compare.mockResolvedValueOnce(true);
      mockJwtHelperService.signAccessToken.mockResolvedValueOnce('accessToken');
      mockJwtHelperService.signRefreshToken.mockResolvedValueOnce(
        'refreshToken',
      );

      const loginDto: LoginDto = {
        usernameOrEmail: 'testuser',
        password: 'password',
      };

      const jwtDto = await authService.loginUser(loginDto);
      expect(jwtDto).toEqual({
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      });
      expect(mockUsersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'testuser',
      );
      expect(mockPasswordService.compare).toHaveBeenCalledWith(
        'password',
        'hashedPassword',
      );
      expect(mockJwtHelperService.signAccessToken).toHaveBeenCalledWith(1);
      expect(mockJwtHelperService.signRefreshToken).toHaveBeenCalledWith(1);
    });

    it('should throw InvalidCredentialsException if user credentials are invalid', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValueOnce(
        userFixture,
      );

      mockPasswordService.compare.mockResolvedValueOnce(false);

      const loginDto: LoginDto = {
        usernameOrEmail: 'testuser',
        password: 'wrongpassword',
      };

      await expect(authService.loginUser(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );

      expect(mockUsersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'testuser',
      );
      expect(mockPasswordService.compare).toHaveBeenCalledWith(
        'wrongpassword',
        'hashedPassword',
      );
    });

    it('should throw InvalidCredentialsException if user not found', async () => {
      mockUsersService.getUserByUsernameOrEmail.mockResolvedValueOnce(null);

      const loginDto: LoginDto = {
        usernameOrEmail: 'nonexistentuser',
        password: 'password',
      };

      await expect(authService.loginUser(loginDto)).rejects.toThrow(
        InvalidCredentialsException,
      );
      expect(mockUsersService.getUserByUsernameOrEmail).toHaveBeenCalledWith(
        'nonexistentuser',
      );
      expect(mockPasswordService.compare).not.toHaveBeenCalled();
    });
  });
});
