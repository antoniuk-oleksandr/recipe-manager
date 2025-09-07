import { Test, TestingModule } from '@nestjs/testing';
import { HealthServiceImpl } from './health.service';

describe('HealthService', () => {
  let service: HealthServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HealthServiceImpl],
    }).compile();

    service = module.get<HealthServiceImpl>(HealthServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
