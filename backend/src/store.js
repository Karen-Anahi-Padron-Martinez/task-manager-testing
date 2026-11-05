'use strict';

const crypto = require('crypto');

/**
 * Almacén en memoria para pruebas. Sustituye a PostgreSQL para que el
 * proyecto sea autocontenido y las pruebas no dependan de una base real.
 */
const users = new Map(); // id -> { id, email }
const tokens = new Map(); // token -> userId
const tasks = new Map(); // id -> { id, ownerId, title, completed }

/** Vacía todos los datos (solo para el entorno de pruebas). */
function reset() {
  users.clear();
  tokens.clear();
  tasks.clear();
}

/**
 * Crea un usuario sintético y un token de acceso de prueba.
 *
 * @param {string} email - Correo sintético del usuario de prueba.
 * @returns {{ id: string, token: string }} Identificador y token.
 */
function createUser(email) {
  const id = crypto.randomUUID();
  const token = crypto.randomBytes(16).toString('hex');
  users.set(id, { id, email });
  tokens.set(token, id);
  return { id, token };
}

module.exports = { users, tokens, tasks, reset, createUser };
