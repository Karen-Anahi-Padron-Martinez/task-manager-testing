# Plan de pruebas — Task Manager

| Campo | Notas |
|---|---|
| Feature/release | Creación, edición y consulta de tareas (v1) |
| Alcance | Incluye: crear, ver y actualizar tareas; autenticación por token; aislamiento entre usuarios. Excluye: registro/login completo, refresh de tokens, notificaciones |
| Riesgos | Un usuario accede a tareas de otro (alto); pérdida de datos al editar (alto); títulos inválidos aceptados (medio); caída de la API bajo carga (medio) |
| Entorno de pruebas | API Node.js/Express local (`backend/`), almacén en memoria (sustituye a PostgreSQL), módulo Flutter (`mobile/`), emulador Android/iOS |
| Datos de prueba | Usuarios sintéticos `*@example.test`, tokens generados por prueba, datos desechables; se reinician con `store.reset()` antes de cada prueba |
| Tipos de prueba | Unitarias (Jest, flutter_test), widgets, API/integración (Supertest), end-to-end (documentado), exploratoria, seguridad básica, accesibilidad, compatibilidad, rendimiento (k6) |
| Criterios de entrada | API y app compilan; entorno de pruebas aislado; cuentas sintéticas disponibles; alcance acordado |
| Criterios de salida | Todas las pruebas automatizadas pasan; sin defectos de severidad alta abiertos; pruebas de permisos entre usuarios pasan; hallazgos documentados |
| Responsables | Tester: autor del repo. Corrección: equipo de desarrollo. Aprobación: responsable de la actividad |
| Evidencia | `docs/evidence/` (salida de pruebas), `docs/` (reportes), historial de commits |

## Qué queda sin probar (declarado)
- Pruebas con PostgreSQL real y flujo completo de JWT con refresh tokens (la API de ejemplo usa almacén en memoria y tokens de prueba).
- Pruebas en dispositivos físicos.
- Pruebas de carga más allá del endpoint `/health`.

## Priorización
1. Aislamiento entre usuarios (impacto alto, riesgo alto).
2. Validación de entrada de títulos (impacto medio, probabilidad alta).
3. Estados de pantalla (carga, vacío, error).
4. Rendimiento básico.
