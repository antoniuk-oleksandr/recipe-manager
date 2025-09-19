import { Inject, Injectable } from '@nestjs/common';
import { AuthService } from '../interface/auth.service.interface';
import { JwtDto } from '../domain/dto/jwt.dto';
import { RegisterDto } from '../domain/dto/register.dto';
import type { UsersService } from 'src/api/users/interface/users.service.interface';
import { USERS_SERVICE } from 'src/api/users/constants/users.constants';
import {
  JWT_HELPER_SERVICE,
  PASSWORD_SERVICE,
} from '../constants/auth.constants';
import type { PasswordService } from '../interface/password.service.interface';
import { CreateUserDto } from 'src/api/users/domain/dto/create-user.dto';
import type { JwtHelperService } from '../interface/jwt-helper.service.interface';
import { LoginDto } from '../domain/dto/login.dto';
import { InvalidCredentialsException } from '../exception/invalid-credentials.exception';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(USERS_SERVICE)
    private readonly usersService: UsersService,

    @Inject(PASSWORD_SERVICE)
    private readonly passwordService: PasswordService,

    @Inject(JWT_HELPER_SERVICE)
    private readonly jwtHelperService: JwtHelperService,
  ) {}

  async loginUser(loginDto: LoginDto): Promise<JwtDto> {
    const user = await this.usersService.getUserByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );

    if (!user) {
      throw new InvalidCredentialsException();
    }

    const isPasswordValid = await this.passwordService.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }

    return {
      accessToken: await this.jwtHelperService.signAccessToken(user.id),
      refreshToken: await this.jwtHelperService.signRefreshToken(user.id),
    };
  }

  async registerUser(registerDto: RegisterDto): Promise<JwtDto> {
    const { password, ...plainRegisterDto } = registerDto;

    const user: CreateUserDto = {
      ...plainRegisterDto,
      passwordHash: await this.passwordService.hash(password),
    };

    const createdUser = await this.usersService.createUser(user);

    return {
      accessToken: await this.jwtHelperService.signAccessToken(createdUser.id),
      refreshToken: await this.jwtHelperService.signRefreshToken(
        createdUser.id,
      ),
    };
  }
}
