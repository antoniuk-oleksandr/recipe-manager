/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { INestApplication } from '@nestjs/common';
import { DbService } from 'src/db/service/db.service';
import { usersTable } from 'src/db/tables/users';
import { createTestApp } from 'src/utils/create-test-app';
import request from 'supertest';
import { UserNotFoundException } from '../exception/user-not-found.exception';

describe('UsersController', () => {
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

  describe('GET /users/:id', () => {
    it('should return 200 status and a user object', async () => {
      const [user] = await dbService.db
        .insert(usersTable)
        .values({
          email: 'test@gmail.com',
          username: 'test',
          passwordHash: 'hashedPassword',
        })
        .returning();

      expect(user).toBeDefined();

      const expectedRespBody = {
        id: user.id,
        email: 'test@gmail.com',
        username: 'test',
      };

      return request(app.getHttpServer())
        .get(`/api/v1/users/${user.id}`)
        .expect(200)
        .expect((resp) => {
          expect(resp.body).toEqual(expectedRespBody);
        });
    });

    it("should return 404 status if user doesn't exists", async () => {
      return request(app.getHttpServer())
        .get('/api/v1/users/999')
        .expect(404)
        .expect((resp) => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          expect(resp.body.message).toBe(new UserNotFoundException().message);
        });
    });
  });
});
