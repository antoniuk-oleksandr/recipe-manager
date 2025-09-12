import { JwtDto } from '../domain/dto/jwt.dto';
import { RegisterDto } from '../domain/dto/register.dto';

export interface AuthService {
  registerUser(registerDto: RegisterDto): Promise<JwtDto>;
}
