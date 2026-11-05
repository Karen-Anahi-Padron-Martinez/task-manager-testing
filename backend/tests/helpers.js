'use strict';

const request = require('supertest');
const { app } = require('../src/app');
const store = require('../src/store');

/** Crea un usuario sintético y devuelve su token de acceso de prueba. */
async function createTestUserAndGetToken() {
  const { token } = store.createUser(`user-${Math.random()}@example.test`);
  return token;
}

/** Crea una tarea por la API y devuelve su id. */
async function createTask(token, title) {
  const response = await request(app)
    .post('/api/v1/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title });
  return response.body.id;
}

module.exports = { createTestUserAndGetToken, createTask };
