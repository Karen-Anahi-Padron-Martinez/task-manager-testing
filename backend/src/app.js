'use strict';

const crypto = require('crypto');
const express = require('express');
const { validateTitle } = require('./tasks/validation');
const store = require('./store');

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const app = express();
app.use(express.json({ limit: '10kb' }));

/** Endpoint de salud, usado por el script de k6. */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

/** Exige un token Bearer válido y guarda el usuario en req.userId. */
function authenticate(req, res, next) {
  const header = req.get('Authorization') || '';
  const [scheme, token] = header.split(' ');
  const userId = scheme === 'Bearer' ? store.tokens.get(token) : undefined;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  req.userId = userId;
  return next();
}

/**
 * Carga la tarea de la ruta solo si pertenece al usuario autenticado.
 * Usa 404 tanto si no existe como si es de otro usuario, para no revelar
 * si la tarea de otra persona existe.
 */
function loadOwnedTask(req, res, next) {
  const { id } = req.params;

  if (!UUID_RE.test(id)) {
    return res.status(400).json({ error: 'Invalid task id.' });
  }

  const task = store.tasks.get(id);

  if (!task || task.ownerId !== req.userId) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  req.task = task;
  return next();
}

/** Devuelve solo los campos públicos de una tarea (sin ownerId). */
function publicTask(task) {
  return { id: task.id, title: task.title, completed: task.completed };
}

app.post('/api/v1/tasks', authenticate, (req, res) => {
  let title;

  try {
    title = validateTitle((req.body || {}).title);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  // El dueño siempre sale del token, nunca del cuerpo de la petición.
  const task = {
    id: crypto.randomUUID(),
    ownerId: req.userId,
    title,
    completed: false,
  };
  store.tasks.set(task.id, task);

  return res.status(201).json(publicTask(task));
});

app.get('/api/v1/tasks/:id', authenticate, loadOwnedTask, (req, res) => {
  res.status(200).json(publicTask(req.task));
});

app.put('/api/v1/tasks/:id', authenticate, loadOwnedTask, (req, res) => {
  const body = req.body || {};

  if ('title' in body) {
    try {
      req.task.title = validateTitle(body.title);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  if ('completed' in body) {
    if (typeof body.completed !== 'boolean') {
      return res.status(400).json({ error: 'Invalid completed value.' });
    }
    req.task.completed = body.completed;
  }

  // Cualquier otro campo (por ejemplo ownerId) se ignora.
  return res.status(200).json(publicTask(req.task));
});

// JSON mal formado u otros errores del cuerpo -> 400 seguro.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const safe = status >= 400 && status < 500;
  res
    .status(safe ? status : 500)
    .json({ error: safe ? 'Invalid request.' : 'Internal error.' });
});

module.exports = { app };
