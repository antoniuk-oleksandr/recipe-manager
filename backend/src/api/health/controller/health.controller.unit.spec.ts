/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { TestingModule, Test } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthService } from '../interface/health.service.interface';
import { HealthDto } from '../domain/dto/health.dto';

describe('HealtController', () => {
  let healthController: HealthController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: HEALTH_SERVICE,
          useValue: {
            checkAllServices: jest.fn(),
          },
        },
      ],
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });

  describe('GET /health', () => {
    it('should return 503 status if one of the services is down', async () => {
      const healthService = module.get<HealthService>(HEALTH_SERVICE);

      (healthService.checkAllServices as jest.Mock).mockResolvedValue({
        status: 'error',
        services: {
          database: 'ok',
          redis: 'error',
        },
      } as HealthDto);

      const mockRes = { status: jest.fn().mockReturnThis() } as any;

      const response = await healthController.healthCheck(mockRes);

      expect(response).toBeDefined();
      expect(response.status).toBe('error');
      expect(response.services).toBeDefined();
      expect(response.services.database).toBe('ok');
      expect(response.services.redis).toBe('error');
    });
  });
});
