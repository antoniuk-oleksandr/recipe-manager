/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { DbService } from 'src/db/service/db.service';
import { createTestApp } from 'src/utils/create-test-app';
import request from 'supertest';

describe('AuthController', () => {
  let app: INestApplication;
  let dbService: DbService;

  beforeEach(async () => {
    app = await createTestApp();
    dbService = app.get<DbService>(DbService);

    await dbService.db.execute('BEGIN');
  });

  afterEach(async () => {
    await dbService.db.execute('ROLLBACK');
    await app.close();
  });

  describe('POST /auth/session', () => {
    it('should return 201 status and a JWT DTO', async () => {
      const reqBody = {
        email: 'test@gmail.com',
        username: 'test',
        password: 'Test123#',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/session')
        .send(reqBody)
        .expect(201)
        .expect((resp) => {
          expect(resp.body).toBeDefined();
          expect(resp.body.accessToken).toBeDefined();
          expect(typeof resp.body.accessToken).toBe('string');
          expect(resp.body.refreshToken).toBeDefined();
          expect(typeof resp.body.refreshToken).toBe('string');
        });
    });
  });
});
