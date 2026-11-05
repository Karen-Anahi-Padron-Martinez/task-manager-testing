'use strict';

const request = require('supertest');
const { app } = require('../src/app');
const store = require('../src/store');
const { createTestUserAndGetToken, createTask } = require('./helpers');

const MISSING_ID = '00000000-0000-4000-8000-000000000000';

beforeEach(() => {
  store.reset();
});

describe('health', () => {
  test('GET /health returns 200', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
  });
});

describe('task API - authentication', () => {
  test('rejects task creation without authentication', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .send({ title: 'Plan tests' });

    expect(response.status).toBe(401);
  });

  test('rejects an invalid token', async () => {
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', 'Bearer not-a-real-token')
      .send({ title: 'Plan tests' });

    expect(response.status).toBe(401);
  });
});

describe('task API - validation', () => {
  test('creates a task with a valid title', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '  Plan tests  ' });

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Plan tests');
    expect(response.body.completed).toBe(false);
  });

  test('rejects an empty (whitespace-only) title', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '   ' });

    expect(response.status).toBe(400);
  });

  test('rejects a missing title', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
  });

  test('rejects a title with the wrong type', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 42 });

    expect(response.status).toBe(400);
  });

  test('rejects a title over 120 characters', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'a'.repeat(121) });

    expect(response.status).toBe(400);
  });

  test('rejects malformed JSON safely', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send('{"title": ');

    expect(response.status).toBe(400);
  });

  test('rejects an invalid task id', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .get('/api/v1/tasks/not-a-uuid')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
  });

  test('returns 404 for a task id that does not exist', async () => {
    const token = await createTestUserAndGetToken();
    const response = await request(app)
      .get(`/api/v1/tasks/${MISSING_ID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
  });
});

describe('task API - ownership (broken object-level authorization)', () => {
  test('lets the owner read their own task', async () => {
    const owner = await createTestUserAndGetToken();
    const taskId = await createTask(owner, 'Private task');

    const response = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${owner}`);

    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Private task');
  });

  test('does not let one user read another user task', async () => {
    const owner = await createTestUserAndGetToken();
    const stranger = await createTestUserAndGetToken();
    const taskId = await createTask(owner, 'Private task');

    const response = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${stranger}`);

    expect([403, 404]).toContain(response.status);
  });

  test('does not let one user update another user task', async () => {
    const owner = await createTestUserAndGetToken();
    const stranger = await createTestUserAndGetToken();
    const taskId = await createTask(owner, 'Private task');

    const response = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${stranger}`)
      .send({ title: 'Hacked' });

    expect([403, 404]).toContain(response.status);

    const check = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${owner}`);
    expect(check.body.title).toBe('Private task');
  });

  test('uses the same response for "not yours" and "does not exist"', async () => {
    const owner = await createTestUserAndGetToken();
    const stranger = await createTestUserAndGetToken();
    const taskId = await createTask(owner, 'Private task');

    const notYours = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${stranger}`);
    const missing = await request(app)
      .get(`/api/v1/tasks/${MISSING_ID}`)
      .set('Authorization', `Bearer ${stranger}`);

    expect(notYours.status).toBe(missing.status);
    expect(notYours.body).toEqual(missing.body);
  });

  test('ignores an ownerId sent by the client', async () => {
    const owner = await createTestUserAndGetToken();
    const strangerUser = store.createUser('stranger@example.test');
    const taskId = await createTask(owner, 'Private task');

    const update = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${owner}`)
      .send({ title: 'Still mine', ownerId: strangerUser.id });

    expect(update.status).toBe(200);
    expect(update.body.ownerId).toBeUndefined();

    const asStranger = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${strangerUser.token}`);
    expect(asStranger.status).toBe(404);

    const asOwner = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${owner}`);
    expect(asOwner.status).toBe(200);
    expect(asOwner.body.title).toBe('Still mine');
  });

  test('ignores an ownerId sent when creating a task', async () => {
    const owner = await createTestUserAndGetToken();
    const strangerUser = store.createUser('stranger@example.test');

    const created = await request(app)
      .post('/api/v1/tasks')
      .set('Authorization', `Bearer ${owner}`)
      .send({ title: 'Mine', ownerId: strangerUser.id });

    const asStranger = await request(app)
      .get(`/api/v1/tasks/${created.body.id}`)
      .set('Authorization', `Bearer ${strangerUser.token}`);
    expect(asStranger.status).toBe(404);
  });
});

describe('task API - update', () => {
  test('marks a task as completed', async () => {
    const token = await createTestUserAndGetToken();
    const taskId = await createTask(token, 'Finish report');

    const response = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: true });

    expect(response.status).toBe(200);
    expect(response.body.completed).toBe(true);

    const check = await request(app)
      .get(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(check.body.completed).toBe(true);
  });

  test('rejects a non-boolean completed value', async () => {
    const token = await createTestUserAndGetToken();
    const taskId = await createTask(token, 'Finish report');

    const response = await request(app)
      .put(`/api/v1/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ completed: 'yes' });

    expect(response.status).toBe(400);
  });
});

describe('task API - hostile-looking input is treated as plain text', () => {
  test.each([["' OR '1'='1"], ['<script>alert(1)</script>']])(
    'stores and returns %p unchanged as text',
    async (title) => {
      const token = await createTestUserAndGetToken();
      const created = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title });

      expect(created.status).toBe(201);

      const response = await request(app)
        .get(`/api/v1/tasks/${created.body.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.type).toMatch(/json/);
      expect(response.body.title).toBe(title);
    },
  );
});
