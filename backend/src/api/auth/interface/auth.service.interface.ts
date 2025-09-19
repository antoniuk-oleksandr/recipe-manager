import { JwtDto } from '../domain/dto/jwt.dto';
import { LoginDto } from '../domain/dto/login.dto';
import { RegisterDto } from '../domain/dto/register.dto';

export interface AuthService {
  registerUser(registerDto: RegisterDto): Promise<JwtDto>;
  loginUser(loginDto: LoginDto): Promise<JwtDto>;
}
