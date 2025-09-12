/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { createTestApp } from 'src/utils/create-test-app';
import request from 'supertest';
import { HealthDto } from '../domain/dto/health.dto';

describe('HealthController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await createTestApp();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return 200 status and all services OK', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/v1/health')
        .expect(200);

      const { status, services } = response.body as HealthDto;

      expect(status).toBe('ok');
      expect(services).toBeDefined();

      Object.entries(services).forEach(([serviceName, serviceStatus]) => {
        expect(serviceName).toBeDefined();
        expect(serviceStatus).toBe('ok');
      });
    });
  });
});
