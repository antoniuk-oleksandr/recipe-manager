/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpStatus, INestApplication } from '@nestjs/common';
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

  describe('POST /auth/users', () => {
    it('should return 201 status and a JWT DTO', async () => {
      const reqBody = {
        email: 'test@gmail.com',
        username: 'test',
        password: 'Test123#',
      };

      return request(app.getHttpServer())
        .post('/api/v1/auth/users')
        .send(reqBody)
        .expect(HttpStatus.CREATED)
        .expect((resp) => {
          expect(resp.body).toBeDefined();
          expect(resp.body.accessToken).toBeDefined();
          expect(typeof resp.body.accessToken).toBe('string');
          expect(resp.body.refreshToken).toBeDefined();
          expect(typeof resp.body.refreshToken).toBe('string');
        });
    });
  });

  describe('POST /auth/sessions', () => {
    it('should return 200 status if login success', () => {
      const registerBody = {
        email: 'test@gmail.com',
        username: 'test',
        password: 'Test123#',
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/users')
        .send(registerBody);

      const loginBody = {
        usernameOrEmail: registerBody.username,
        password: registerBody.password,
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/sessions')
        .send(loginBody)
        .expect(HttpStatus.OK)
        .expect((resp) => {
          expect(resp.body).toBeDefined();
          expect(resp.body.accessToken).toBeDefined();
          expect(typeof resp.body.accessToken).toBe('string');
          expect(resp.body.refreshToken).toBeDefined();
          expect(typeof resp.body.refreshToken).toBe('string');
        });
    });

    it('should return 401 status if user does not exists', () => {
      const loginBody = {
        usernameOrEmail: 'test',
        password: 'test',
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/sessions')
        .send(loginBody)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((resp) => {
          expect(resp.body).toBeDefined();
          expect(resp.body.message).toBe('Invalid credential');
        });
    });

    it('should return 401 status if password is incorrect', () => {
      const registerBody = {
        email: 'test@gmail.com',
        username: 'test',
        password: 'Test123#',
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/users')
        .send(registerBody);

      const loginBody = {
        usernameOrEmail: 'test',
        password: 'test',
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/sessions')
        .send(loginBody)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect((resp) => {
          expect(resp.body).toBeDefined();
          expect(resp.body.message).toBe('Invalid credential');
        });
    });

    it('should return 400 status if usernameOrEmail request body field is missing', () => {
      const reqBody = {
        password: 'test',
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/sessions')
        .send(reqBody)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((resp) => {
          expect(resp.body.message).toContain(
            'usernameOrEmail should not be empty',
          );
        });
    });

    it('should return 400 status if password request body field is missing', () => {
      const reqBody = {
        usernameOrEmail: 'test@gmail.com',
      };

      request(app.getHttpServer())
        .post('/api/v1/auth/sessions')
        .send(reqBody)
        .expect(HttpStatus.BAD_REQUEST)
        .expect((resp) => {
          expect(resp.body.message).toContain('passwrod should not be empty');
        });
    });
  });
});
