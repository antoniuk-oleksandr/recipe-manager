import { Test, TestingModule } from '@nestjs/testing';
import { HealthModule } from './health.module';

describe('HealthModul', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });
});
