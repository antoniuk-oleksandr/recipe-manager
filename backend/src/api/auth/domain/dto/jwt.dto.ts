import { ApiProperty } from '@nestjs/swagger';

export class JwtDto {
  @ApiProperty({
    description: 'The access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'The refresh token for obtaining new access tokens',
    example: 'dGhpc19pc19hX3JlZnJlc2hfdG9rZW4uLi4=',
  })
  refreshToken: string;
}
