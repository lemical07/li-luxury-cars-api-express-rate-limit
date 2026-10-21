import { rateLimit } from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  statusCode: 429,
  standardHeaders: "draft-7",
  legacyHeaders: true,
  message: {
    exito: false,
    status: 429,
    error: "Demasiadas solicitudes desde esta IP. Intenta de nuevo en un minuto."
  }
});

export const crearAutoLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 3,
  statusCode: 429,
  standardHeaders: "draft-7",
  legacyHeaders: true,
  message: {
    exito: false,
    status: 429,
    error: "Límite de creación alcanzado: solo puedes registrar 3 autos por minuto."
  }
});
