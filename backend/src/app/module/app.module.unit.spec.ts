import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from 'src/api/auth/module/auth.module';

describe('AppModule', () => {
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
