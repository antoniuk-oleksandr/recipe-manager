import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { IsPassword } from 'src/validator/is-password.decorator';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsPassword()
  password: string;

  @IsNotEmpty()
  username: string;
}
