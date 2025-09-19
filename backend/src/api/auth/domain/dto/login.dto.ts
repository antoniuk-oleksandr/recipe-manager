import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Username or email of the user',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  usernameOrEmail: string;

  @ApiProperty({
    description: 'Password of the user',
    example: 'StrongP@ssw0rd!',
  })
  @IsNotEmpty()
  password: string;
}
