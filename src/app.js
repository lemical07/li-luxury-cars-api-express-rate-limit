import express from "express";
import { logger } from "./middlewares/logger.js";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import autosRouter from "./routes/autos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "Bienvenido a la API REST de autos de lujo.",
    seguridad: "Límite de 5 solicitudes por minuto por IP en /api/.",
    almacenamiento: "Catálogo almacenado en un arreglo JavaScript en memoria.",
    endpoints: {
      listarAutos: "GET /api/autos",
      buscarAuto: "GET /api/autos/:id",
      crearAuto: "POST /api/autos",
      actualizarAuto: "PUT /api/autos/:id",
      eliminarAuto: "DELETE /api/autos/:id"
    }
  });
});

app.use("/api/", apiLimiter);
app.use("/api/autos", autosRouter);

app.use((req, res) => {
  res.status(404).json({
    exito: false,
    error: `La ruta '${req.method} ${req.originalUrl}' no existe.`
  });
});

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`API de autos de lujo disponible en http://localhost:${PORT}`);
    console.log("Rate limit activo en /api/: 5 solicitudes por minuto.");
  });
}

export default app;
