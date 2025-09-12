import { Test } from '@nestjs/testing';
import { DbService } from 'src/db/service/db.service';
import { HEALTH_SERVICE } from '../constants/health.constants';
import { HealthService } from '../interface/health.service.interface';
import { HealthServiceImpl } from './health.service';

const createMockDb = (rows: any[]) => ({
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  limit: jest.fn().mockResolvedValue(rows),
  $client: {
    query: jest.fn().mockResolvedValue({ rows }),
  },
});

describe('HealthService', () => {
  let mockDbService: DbService;
  let healthService: HealthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: HEALTH_SERVICE,
          useClass: HealthServiceImpl,
        },
        {
          provide: DbService,
          useValue: {},
        },
      ],
    }).compile();

    mockDbService = module.get<DbService>(DbService);
    healthService = module.get<HealthService>(HEALTH_SERVICE);
  });

  describe('checkPostgres', () => {
    it('should return ok status when query is successful', async () => {
      Object.defineProperty(mockDbService, 'db', {
        get: () => createMockDb([]),
      });

      const result = await healthService.checkPostgres();
      expect(result).toEqual({ name: 'postgres', status: 'ok' });
    });

    it('should return error status when query fails', async () => {
      Object.defineProperty(mockDbService, 'db', {
        get: () => ({
          $client: {
            query: jest.fn().mockRejectedValue(new Error('DB error')),
          },
        }),
      });

      const result = await healthService.checkPostgres();
      expect(result).toEqual({ name: 'postgres', status: 'error' });
    });
  });

  describe('checkAllServices', () => {
    it('should return overall ok status when all services are ok', async () => {
      Object.defineProperty(mockDbService, 'db', {
        get: () => createMockDb([]),
      });

      const result = await healthService.checkAllServices();
      expect(result).toEqual({
        status: 'ok',
        services: {
          postgres: 'ok',
        },
      });
    });

    it('should return overall error status when any service is error', async () => {
      Object.defineProperty(mockDbService, 'db', {
        get: () => ({
          $client: {
            query: jest.fn().mockRejectedValue(new Error('DB error')),
          },
        }),
      });

      const result = await healthService.checkAllServices();
      expect(result).toEqual({
        status: 'error',
        services: {
          postgres: 'error',
        },
      });
    });
  });
});
