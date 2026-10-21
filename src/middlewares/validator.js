export function validarAuto(req, res, next) {
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
    return res.status(400).json({
      exito: false,
      error: "Se requiere enviar un cuerpo JSON válido."
    });
  }

  const { marca, modelo, anio, precio, categoria, color } = req.body;
  const camposTexto = { marca, modelo, categoria, color };

  for (const [campo, valor] of Object.entries(camposTexto)) {
    if (typeof valor !== "string" || valor.trim().length === 0) {
      return res.status(400).json({
        exito: false,
        error: `El campo '${campo}' es obligatorio y debe ser texto.`
      });
    }
  }

  if (!Number.isInteger(anio) || anio < 1886 || anio > new Date().getFullYear() + 1) {
    return res.status(400).json({
      exito: false,
      error: "El campo 'anio' debe ser un año entero válido."
    });
  }

  if (typeof precio !== "number" || !Number.isFinite(precio) || precio <= 0) {
    return res.status(400).json({
      exito: false,
      error: "El campo 'precio' debe ser un número mayor que cero."
    });
  }

  next();
}
