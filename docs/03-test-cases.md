# Casos de prueba

Plantilla: ID y título · Precondiciones · Pasos · Datos de prueba · Resultado esperado · Resultado real · Entorno.

**Entorno de todas las ejecuciones:** Node.js 22, API local (`backend/`), almacén en memoria, Jest + Supertest.

---

## TC-001 — Crear una tarea con título válido
- **Precondiciones:** Usuario A sintético con token de prueba.
- **Pasos:**
  1. Enviar `POST /api/v1/tasks` con el token de A.
  2. Incluir el cuerpo JSON con el título.
- **Datos de prueba:** `{ "title": "  Plan tests  " }`
- **Resultado esperado:** 201; `title` = `"Plan tests"`; `completed` = `false`.
- **Resultado real:** Coincide con lo esperado (prueba automatizada pasa).
- **Evidencia:** `docs/evidence/backend-test-output.txt`

## TC-002 — Rechazar un título formado solo por espacios
- **Precondiciones:** Usuario A sintético con token de prueba.
- **Pasos:**
  1. Enviar `POST /api/v1/tasks` con el token de A.
  2. Incluir un título de solo espacios.
- **Datos de prueba:** `{ "title": "   " }`
- **Resultado esperado:** 400 con mensaje de error; no se crea ninguna tarea.
- **Resultado real:** Coincide con lo esperado (prueba automatizada pasa).
- **Evidencia:** `docs/evidence/backend-test-output.txt`

## TC-003 — Un usuario no puede leer la tarea de otro
- **Precondiciones:** Usuarios A y B sintéticos; A tiene una tarea "Private task".
- **Pasos:**
  1. Enviar `GET /api/v1/tasks/{id de la tarea de A}` con el token de B.
- **Datos de prueba:** ID de la tarea de A; token de B.
- **Resultado esperado:** 403 o 404, sin revelar si la tarea existe (se usa 404, igual que para un ID inexistente).
- **Resultado real:** Coincide con lo esperado (prueba automatizada pasa).
- **Evidencia:** `docs/evidence/backend-test-output.txt`

## TC-004 — Rechazar petición sin autenticación
- **Precondiciones:** Ninguna.
- **Pasos:** Enviar `POST /api/v1/tasks` sin encabezado `Authorization`.
- **Datos de prueba:** `{ "title": "Plan tests" }`
- **Resultado esperado:** 401.
- **Resultado real:** Coincide con lo esperado (prueba automatizada pasa).
