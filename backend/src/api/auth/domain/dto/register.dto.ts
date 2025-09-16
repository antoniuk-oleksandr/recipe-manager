import { IsEmail, IsNotEmpty } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsPassword } from 'src/validator/is-password.decorator';

export class RegisterDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'StrongP@ssw0rd!',
  })
  @IsPassword()
  password: string;

  @ApiProperty({
    description: 'The username for the user account',
    example: 'john_doe',
  })
  @IsNotEmpty()
  username: string;
}
