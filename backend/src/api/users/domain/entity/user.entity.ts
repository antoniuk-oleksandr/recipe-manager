import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserEntity {
  @ApiProperty({
    description: 'Unique identifier for the user',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Username of the user',
    example: 'john_doe',
  })
  username: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @Exclude()
  @ApiProperty({
    description: 'Hashed password of the user (excluded from responses)',
    example: '$2b$10$abcdefghijklmnopqrstuv',
    writeOnly: true,
  })
  passwordHash: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
