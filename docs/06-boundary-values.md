# Valores límite y particiones de equivalencia

## Título de tarea (1 a 120 caracteres)

| Partición o límite | Entrada de ejemplo | Resultado esperado | Cubierto por |
|---|---|---|---|
| Vacío | `""` | Rechazar | `validation.test.js` |
| Solo espacios | `"   "` | Rechazar | `validation.test.js`, `api.test.js` |
| Longitud mínima válida | `"a"` | Aceptar | `validation.test.js` |
| Título típico válido | `"Plan tests"` | Aceptar | `validation.test.js`, `api.test.js` |
| Longitud máxima válida | 120 caracteres | Aceptar | `validation.test.js`, `task_test.dart` |
| Justo por encima del máximo | 121 caracteres | Rechazar | `validation.test.js`, `api.test.js` |
| Tipo incorrecto en JSON | `title: 42` | Rechazar con seguridad | `validation.test.js`, `api.test.js` |

## Contraseña (ejercicio de la guía)

> **Supuesto:** la guía no define las reglas de la contraseña. Para este ejercicio se asume una longitud permitida de **8 a 64 caracteres**. Ajusta la tabla a la regla real de tu app. Usa solo contraseñas de prueba, nunca reales.

| Partición o límite | Entrada de ejemplo | Resultado esperado |
|---|---|---|
| Vacía | `""` | Rechazar |
| Un carácter por debajo del mínimo | 7 caracteres | Rechazar |
| Longitud mínima válida | 8 caracteres | Aceptar |
| Típica válida | `local-test-password` | Aceptar |
| Longitud máxima válida | 64 caracteres | Aceptar |
| Un carácter por encima del máximo | 65 caracteres | Rechazar |
| Tipo incorrecto | `password: 12345678` (número) | Rechazar con seguridad |
