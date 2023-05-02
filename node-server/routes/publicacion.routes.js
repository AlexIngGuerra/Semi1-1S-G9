import { Router } from "express";
import {
  getEtiquetas,
  getFotosPerfil,
  getPublicacionesEtiqueta,
  getPublicacionesTodas,
  subirFoto,
  crearComentario,
} from "../controllers/publicacion.controller.js";

const router = Router();

router.get("/get-fotos-perfil", getFotosPerfil);
router.get("/get-publicacion-todo", getPublicacionesTodas);
router.get("/get-etiquetas", getEtiquetas);
router.get("/get-publicacion/:etiqueta", getPublicacionesEtiqueta);

router.post("/subir-foto", subirFoto);
router.post("/Comentario", crearComentario);

export default router;
