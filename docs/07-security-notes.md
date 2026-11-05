# Notas de seguridad básica

Todas las pruebas se hicieron **solo en el entorno local** de este repo, con datos sintéticos.

## Pruebas automatizadas (en `backend/tests/api.test.js`)

| Preocupación (OWASP API) | Verificación | Resultado |
|---|---|---|
| Autenticación rota | Sin token y con token inválido → 401 | Pasa |
| Autorización a nivel de objeto (BOLA) | Usuario B no puede leer ni actualizar la tarea de A; respuesta idéntica a la de un ID inexistente | Pasa |
| Autorización a nivel de propiedad | `ownerId` enviado por el cliente se ignora al crear y al actualizar | Pasa |
| Validación de entrada | Tipo incorrecto, título faltante, título de 121 caracteres, JSON mal formado, ID inválido → 400 | Pasa |
| Cadenas tipo inyección SQL | `' OR '1'='1` se guarda y se devuelve como texto normal | Pasa |
| Marcado tipo XSS | `<script>alert(1)</script>` se devuelve como texto dentro de JSON (`application/json`) | Pasa |
| Consumo de recursos | Cuerpo de petición limitado a 10 kb | Configurado (`express.json({ limit: '10kb' })`) |

## Ejercicio de la guía
> "Intentar actualizar una tarea con un campo `ownerId`; verificar que la API lo ignora o rechaza."

Cubierto por la prueba **"ignores an ownerId sent by the client"**: el dueño sigue siendo el usuario del token y otro usuario sigue recibiendo 404.

## Pendiente (fuera del alcance de la API de ejemplo)
- Limitación de intentos (rate limiting) en login y refresh.
- Expiración, rotación y detección de reutilización de refresh tokens; logout y logout-all.
- Cabeceras seguras, HTTPS y CORS restringido en producción.
- Verificar en la UI de Flutter que el marcado se muestra como texto (un `Text` de Flutter no interpreta HTML).

## Reglas respetadas
- No se probó ningún sistema ajeno ni de producción.
- No se incluyen tokens ni contraseñas reales.
