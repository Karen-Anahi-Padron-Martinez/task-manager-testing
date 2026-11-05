# Pruebas de humo y lista de regresión

## Suite de humo (después de cada build o despliegue)
- [ ] La app abre.
- [ ] El login funciona.
- [ ] La lista de tareas carga.
- [ ] Se puede crear una tarea.
- [ ] El logout funciona.

En la API: `GET /health` responde 200 (cubierto por `api.test.js` y `perf/health-test.js`).

## Lista de regresión

| Área | Verificación | Automatizada en |
|---|---|---|
| Creación | Título válido se guarda; vacío/blanco/largo se rechaza | `api.test.js`, `validation.test.js` |
| Edición | Cambiar título válido; título inválido se rechaza | `api.test.js` |
| Completado | Marcar como completa y verificar que persiste; valor no booleano se rechaza | `api.test.js` |
| Eliminación | _(pendiente: la API de ejemplo aún no tiene DELETE)_ | — |
| Acceso entre usuarios | B no puede leer ni modificar tareas de A; `ownerId` se ignora | `api.test.js` |
| Estados de pantalla | Carga, vacío, error y datos; botón de reintento | `task_list_panel_test.dart` |
| Modelo | `Task.fromJson` rechaza datos inválidos | `task_test.dart` |

## Datos de prueba
- Sintéticos y reproducibles; se reinician con `store.reset()` antes de cada prueba.
- Nunca reiniciar una base de datos compartida o de producción.
- Registrar entorno y build en cada ejecución para poder reproducirla.
