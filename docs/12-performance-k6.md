# Rendimiento con k6

Script: [`perf/health-test.js`](../perf/health-test.js)

## Cómo ejecutarlo (solo contra tu API local)
```bash
cd backend && npm start        # terminal 1
BASE_URL=http://localhost:3000 k6 run perf/health-test.js   # terminal 2
```

> **Importante:** k6 no estaba instalado en el entorno donde se generó este repo, así que **no hay resultados incluidos**. Ejecuta el script en tu máquina y completa las tablas con tus resultados reales antes de entregar. Para instalar k6: https://grafana.com/docs/k6/latest/set-up/install-k6/

## Configuración base
- 5 usuarios virtuales durante 30 segundos.
- Umbrales: errores < 1 % y p(95) < 500 ms.

## Resultado de la ejecución base
| Métrica | Valor |
|---|---|
| Peticiones totales | _(completa)_ |
| Tasa de error (`http_req_failed`) | _(completa)_ |
| p(95) de `http_req_duration` | _(completa)_ |
| ¿Cumplió los umbrales? | _(completa)_ |

## Ejercicio: cambiar un umbral y volver a ejecutar
- Umbral cambiado: _(por ejemplo `p(95)<500` → `p(95)<5`)_
- Resultado: _(completa)_
- Explicación de lo que dice el reporte: _(completa)_

## Reglas
No hacer pruebas de carga contra producción sin autorización por escrito, coordinación y un plan de parada.
