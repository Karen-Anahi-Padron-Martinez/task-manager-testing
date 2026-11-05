# Criterios de aceptación — Creación de tareas

**Requisito:** "Un usuario autenticado puede crear una tarea."

| # | Tipo | Criterio de aceptación | Prueba automatizada |
|---|---|---|---|
| 1 | Éxito típico | Una tarea con título válido se guarda y se devuelve con estado 201, el título sin espacios sobrantes y `completed: false`. | `backend/tests/api.test.js` — "creates a task with a valid title" |
| 2 | Entrada inválida | Un título formado solo por espacios se rechaza con 400 y un mensaje claro ("Enter a valid title."). | `backend/tests/api.test.js` — "rejects an empty (whitespace-only) title" |
| 3 | Límite de permisos | Un usuario no puede ver la tarea de otra cuenta cambiando el ID: la API responde 404 (misma respuesta que para un ID inexistente). | `backend/tests/api.test.js` — "does not let one user read another user task" |

## Criterios adicionales
- Sin token o con token inválido la API responde 401.
- Un título de más de 120 caracteres se rechaza con 400.
- Un `ownerId` enviado por el cliente se ignora; el dueño sale del token.
