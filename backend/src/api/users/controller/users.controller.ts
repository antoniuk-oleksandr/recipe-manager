import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { UsersService } from '../interface/users.service.interface';
import { USERS_SERVICE } from '../constants/users.constants';
import { UserEntity } from '../domain/entity/user.entity';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(
    @Inject(USERS_SERVICE)
    private readonly usersService: UsersService,
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user data',
    type: UserEntity,
    content: {
      'application/json': {
        example: {
          id: 1,
          username: 'john_doe',
          email: 'john.doe@example.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          error: 'NOT_FOUND',
          message: 'User not found',
          path: '/api/v1/users/123',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed for the provided user ID',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          error: 'BAD_REQUEST',
          message: 'Validation failed (numeric string is expected)',
          path: '/api/v1/users/s',
        },
      },
    },
  })
  async getUserById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserEntity> {
    return await this.usersService.getUserById(id);
  }
}
