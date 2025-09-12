import { AuthModule } from './auth.module';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

describe('AuthModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(ConfigService)
      .useValue({ getOrThrow: jest.fn() })
      .compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
