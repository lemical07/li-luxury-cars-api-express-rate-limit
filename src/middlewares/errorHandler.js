export function errorHandler(err, req, res, next) {
  console.error("[ERROR DEL SERVIDOR]:", err.message || err);

  const statusCode = err.statusCode || err.status || 500;
  const message =
    statusCode < 500
      ? err.message || "La solicitud no es válida."
      : "Error interno del servidor.";

  res.status(statusCode).json({
    exito: false,
    error: {
      codigo: statusCode,
      mensaje: message
    }
  });
}
