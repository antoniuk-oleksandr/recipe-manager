import { Body, Controller, Inject, Post } from '@nestjs/common';
import type { AuthService } from '../interface/auth.service.interface';
import { AUTH_SERVICE } from '../constants/auth.constants';
import { RegisterDto } from '../domain/dto/register.dto';
import { JwtDto } from '../domain/dto/jwt.dto';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: AuthService,
  ) {}

  @Post('session')
  async registerUser(@Body() registerDto: RegisterDto): Promise<JwtDto> {
    return await this.authService.registerUser(registerDto);
  }
}
