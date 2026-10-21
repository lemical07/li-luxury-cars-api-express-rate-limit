# API REST de autos de lujo

API backend para consultar y administrar un catálogo de autos de lujo con
Express.js. Los datos se guardan en un arreglo JavaScript en memoria; no se
utilizan bases de datos ni se incluye un frontend. Las rutas de la API están
protegidas con `express-rate-limit`.

## Requisitos

- Node.js 18 o superior.
- npm.
- Postman (opcional, para probar los endpoints).

Las dependencias del proyecto ya están declaradas en `package.json`: Express,
`express-rate-limit` y Nodemon para desarrollo.

## Estructura

```text
src/
├── app.js
├── data/
│   └── autos.db.js
├── middlewares/
│   ├── errorHandler.js
│   ├── logger.js
│   ├── rateLimiter.js
│   └── validator.js
└── routes/
    └── autos.routes.js
```

El catálogo completo está en `src/data/autos.db.js`. Los cambios realizados
mediante POST, PUT y DELETE se conservan en memoria mientras el proceso está
activo y se pierden al reiniciar el servidor.

## Instalación y ejecución

Desde la raíz del proyecto:

```bash
npm install
npm run dev
```

El servidor inicia en `http://localhost:3000`. Se puede cambiar el puerto con
la variable de entorno `PORT`.

## Endpoints

Todas las rutas de autos comienzan con `/api/autos`.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Mensaje de bienvenida y resumen de la API. |
| GET | `/api/autos` | Lista todos los autos. |
| GET | `/api/autos/:id` | Busca un auto por su ID numérico. |
| POST | `/api/autos` | Agrega un auto al catálogo en memoria. |
| PUT | `/api/autos/:id` | Reemplaza los datos de un auto existente. |
| DELETE | `/api/autos/:id` | Elimina un auto existente. |

Los objetos de auto requieren `marca`, `modelo`, `anio`, `precio`, `categoria`
y `color`. `anio` debe ser un año entero válido y `precio` un número mayor que
cero. Por ejemplo:

```json
{
  "marca": "Mercedes-Benz",
  "modelo": "S-Class",
  "anio": 2025,
  "precio": 125000,
  "categoria": "Sedán de lujo",
  "color": "Negro obsidiana"
}
```

Las respuestas usan JSON y comunican los errores con códigos HTTP apropiados,
como `400` para solicitudes inválidas y `404` cuando no se encuentra un auto.

## Límite de solicitudes

`express-rate-limit` limita por dirección IP:

- Todas las rutas bajo `/api/` aceptan hasta **5 solicitudes por minuto**.
- `POST /api/autos` tiene además un límite de **3 creaciones por minuto**.
- Al superar cualquiera de los límites, el servidor responde con HTTP `429
  Too Many Requests`.

Las cabeceras `RateLimit` y `X-RateLimit-*` informan el límite y las solicitudes
restantes. La ruta raíz `/` no está sujeta al limitador general.

## Pruebas con Postman

1. Inicia el servidor con `npm run dev`.
2. Crea una solicitud `GET` a `http://localhost:3000/api/autos` para consultar
   el catálogo.
3. Prueba `GET http://localhost:3000/api/autos/1` para obtener un auto por ID.
4. Para crear un auto, elige `POST http://localhost:3000/api/autos`, selecciona
   **Body → raw → JSON** y envía el objeto de ejemplo anterior.
5. Para editarlo, usa `PUT http://localhost:3000/api/autos/ID` con el objeto
   completo en el cuerpo JSON. Para eliminarlo, usa
   `DELETE http://localhost:3000/api/autos/ID`.
6. Envía cuatro solicitudes POST en menos de un minuto para comprobar que la
   cuarta recibe HTTP `429`. También puedes exceder las cinco solicitudes por
   minuto de la API para probar el límite general. Espera a que termine la
   ventana para volver a enviar solicitudes.