import { Inject, Injectable } from '@nestjs/common';
import { PasswordService } from '../interface/password.service.interface';
import { BCRYPT } from '../constants/auth.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordServiceImpl implements PasswordService {
  private readonly passwordSaltRounds: number;

  constructor(
    @Inject(BCRYPT)
    private readonly bcrypt: typeof import('bcryptjs'),
    private readonly configService: ConfigService,
  ) {
    this.passwordSaltRounds =
      this.configService.getOrThrow<number>('passwordSaltRounds');
  }

  async hash(password: string): Promise<string> {
    return await this.bcrypt.hash(password, this.passwordSaltRounds);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await this.bcrypt.compare(password, hash);
  }
}
