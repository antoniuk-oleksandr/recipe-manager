import { JwtPayloadDto } from '../domain/dto/jwt-payload.dto';

export interface JwtHelperService {
  createJwtPayload(sub: number): JwtPayloadDto;
  signAccessToken(sub: number): Promise<string>;
  signRefreshToken(sub: number): Promise<string>;
}
