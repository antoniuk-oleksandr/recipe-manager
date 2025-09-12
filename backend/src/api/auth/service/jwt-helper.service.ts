import { Injectable } from '@nestjs/common';
import { JwtHelperService } from '../interface/jwt-helper.service.interface';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayloadDto } from '../domain/dto/jwt-payload.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class JwtHelperServiceImpl implements JwtHelperService {
  private readonly accessTokenExpiresIn: string;
  private readonly refreshTokenExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenExpiresIn =
      this.configService.getOrThrow<string>('jwtAccessExpiresIn')!;
    this.refreshTokenExpiresIn = this.configService.getOrThrow<string>(
      'jwtRefreshExpiresIn',
    )!;
  }

  createJwtPayload(sub: number): JwtPayloadDto {
    return { sub, jti: uuidv4() };
  }

  async signRefreshToken(sub: number): Promise<string> {
    const payload = this.createJwtPayload(sub);

    return this.jwtService.signAsync(payload, {
      expiresIn: this.refreshTokenExpiresIn,
    });
  }

  async signAccessToken(sub: number): Promise<string> {
    const payload = this.createJwtPayload(sub);

    return this.jwtService.signAsync(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });
  }
}
