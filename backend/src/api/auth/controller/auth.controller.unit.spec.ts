/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AUTH_SERVICE } from '../constants/auth.constants';
import { AuthService } from '../interface/auth.service.interface';
import { UserAlreadyExistsException } from 'src/api/users/exception/user-already-exists.exception';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService & { registerUser: jest.Mock };
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AUTH_SERVICE,
          useValue: {
            registerUser: jest.fn(),
            loginUser: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get(AUTH_SERVICE);
  });

  describe('POST /auth/users', () => {
    it('should throw 409 if user already exists', async () => {
      authService.registerUser.mockRejectedValueOnce(
        new UserAlreadyExistsException(),
      );

      const reqBody = {
        email: 'test@gmail.com',
        username: 'test',
        password: 'password',
      };

      await expect(authController.registerUser(reqBody)).rejects.toMatchObject({
        status: 409,
      });
    });
  });

  describe('POST /auth/sessions', () => {
    it('should call AuthService.loginUser and return JWT DTO', async () => {
      const mockJwtDto = { accessToken: 'token', refreshToken: 'refresh' };
      //@ts-ignore
      authService.loginUser.mockResolvedValueOnce(mockJwtDto);

      const reqBody = { usernameOrEmail: 'test', password: 'Test123#' };
      const result = await authController.loginUser(reqBody);

      expect(authService.loginUser).toHaveBeenCalledWith(reqBody);
      expect(result).toEqual(mockJwtDto);
    });
  });
});
