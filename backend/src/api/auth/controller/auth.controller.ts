import {
  Body,
  Controller,
  Inject,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import type { AuthService } from '../interface/auth.service.interface';
import { AUTH_SERVICE } from '../constants/auth.constants';
import { RegisterDto } from '../domain/dto/register.dto';
import { JwtDto } from '../domain/dto/jwt.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LoginDto } from '../domain/dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @Post('sessions')
  @ApiOperation({ summary: 'Authenticate user and create a session' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: JwtDto,
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
    content: {
      'application/json': {
        example: {
          statusCode: 401,
          error: 'UNAUTHORIZED',
          message: 'Invalid credentials',
          path: '/api/v1/auth/sessions',
        },
      },
    },
  })
  async loginUser(@Body() loginDto: LoginDto): Promise<JwtDto> {
    return await this.authService.loginUser(loginDto);
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user and create a session' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: JwtDto,
    content: {
      'application/json': {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists',
    content: {
      'application/json': {
        example: {
          statusCode: 409,
          error: 'CONFLICT',
          message: 'User already exists',
          path: '/api/v1/auth/users',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided data',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          error: 'BAD_REQUEST',
          message: [
            'email must be an email',
            'password must be a valid password',
            'username should not be empty',
          ],
          path: '/api/v1/auth/users',
        },
      },
    },
  })
  async registerUser(@Body() registerDto: RegisterDto): Promise<JwtDto> {
    return await this.authService.registerUser(registerDto);
  }
}
