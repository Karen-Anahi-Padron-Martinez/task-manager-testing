# Reporte de bug — Tarea desaparece al marcarla como completa

> **Nota:** este es el ejercicio 2 de la guía. Describe un defecto **hipotético** para practicar el formato de reporte; la API de ejemplo de este repo no presenta este defecto.

| Campo | Detalle |
|---|---|
| **Resumen** | Al marcar una tarea como completa, la tarea desaparece de la lista y no se puede recuperar. |
| **Entorno** | Android (emulador, pantalla pequeña), app build de prueba, API local |
| **Precondiciones** | Cuenta de prueba `tester@example.test` (sintética) con al menos una tarea llamada "Plan tests" |
| **Pasos para reproducir** | 1. Iniciar sesión con la cuenta de prueba.<br>2. Abrir la lista de tareas.<br>3. Tocar la casilla de completado de "Plan tests".<br>4. Observar la lista.<br>5. Cerrar y volver a abrir la app. |
| **Resultado esperado** | La tarea permanece en la lista, marcada como completa (por ejemplo, tachada), y sigue ahí después de reabrir la app. |
| **Resultado real** | La tarea desaparece de la lista inmediatamente y no vuelve a aparecer al reabrir la app. |
| **Evidencia** | Captura de pantalla redactada (sin datos personales) de la lista antes y después; respuesta de la API con el token oculto |
| **Severidad** | **Alta** — el usuario pierde datos. |
| **Prioridad** | **Alta** — debe corregirse antes del siguiente lanzamiento. |

## Justificación
- **Severidad (impacto):** alta, porque la pérdida de datos del usuario es difícil de revertir.
- **Prioridad (urgencia):** alta, porque afecta una función central y frecuente.
