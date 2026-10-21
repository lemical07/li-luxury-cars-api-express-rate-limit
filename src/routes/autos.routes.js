import { Router } from "express";
import { autos } from "../data/autos.db.js";
import { crearAutoLimiter } from "../middlewares/rateLimiter.js";
import { validarAuto } from "../middlewares/validator.js";

const router = Router();

function obtenerId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({
      exito: false,
      error: "El parámetro ID debe ser un entero positivo."
    });
    return null;
  }

  return id;
}

router.get("/", (req, res) => {
  res.status(200).json({
    exito: true,
    total: autos.length,
    rateLimitInfo: req.rateLimit
      ? {
          limiteVentana: req.rateLimit.limit,
          usados: req.rateLimit.current,
          solicitudesRestantes: req.rateLimit.remaining
        }
      : undefined,
    datos: autos
  });
});

router.get("/:id", (req, res) => {
  const id = obtenerId(req, res);
  if (id === null) return;

  const auto = autos.find((vehiculo) => vehiculo.id === id);
  if (!auto) {
    return res.status(404).json({
      exito: false,
      error: `No se encontró ningún auto con el ID ${id}.`
    });
  }

  res.status(200).json({
    exito: true,
    mensaje: "Auto encontrado.",
    auto
  });
});

router.post("/", crearAutoLimiter, validarAuto, (req, res) => {
  const nuevoId = autos.length > 0
    ? Math.max(...autos.map((auto) => auto.id)) + 1
    : 1;
  const nuevoAuto = {
    id: nuevoId,
    marca: req.body.marca.trim(),
    modelo: req.body.modelo.trim(),
    anio: req.body.anio,
    precio: req.body.precio,
    categoria: req.body.categoria.trim(),
    color: req.body.color.trim()
  };

  autos.push(nuevoAuto);
  res.status(201).json({
    exito: true,
    mensaje: "Auto agregado al catálogo en memoria.",
    auto: nuevoAuto
  });
});

router.put("/:id", validarAuto, (req, res) => {
  const id = obtenerId(req, res);
  if (id === null) return;

  const indice = autos.findIndex((auto) => auto.id === id);
  if (indice === -1) {
    return res.status(404).json({
      exito: false,
      error: `No se puede actualizar: no existe un auto con el ID ${id}.`
    });
  }

  autos[indice] = {
    id,
    marca: req.body.marca.trim(),
    modelo: req.body.modelo.trim(),
    anio: req.body.anio,
    precio: req.body.precio,
    categoria: req.body.categoria.trim(),
    color: req.body.color.trim()
  };

  res.status(200).json({
    exito: true,
    mensaje: `Auto con ID ${id} actualizado.`,
    auto: autos[indice]
  });
});

router.delete("/:id", (req, res) => {
  const id = obtenerId(req, res);
  if (id === null) return;

  const indice = autos.findIndex((auto) => auto.id === id);
  if (indice === -1) {
    return res.status(404).json({
      exito: false,
      error: `No se puede eliminar: no existe un auto con el ID ${id}.`
    });
  }

  const [autoEliminado] = autos.splice(indice, 1);
  res.status(200).json({
    exito: true,
    mensaje: `Auto con ID ${id} eliminado del catálogo.`,
    auto: autoEliminado
  });
});

export default router;
