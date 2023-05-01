import { Router } from "express";
import {aceptarAmigo, agregarAmigo, listadoDesconocidos, rechazarAmigo, solicitudAmistad} from "../controllers/amigo.controller.js"

const router = Router();

router.get("/listar-desconocidos", listadoDesconocidos)
router.get("/solicitudes-amistad", solicitudAmistad)
router.get("/rechazar-amistad/:solicitud", rechazarAmigo)
router.get("/aceptar-amistad/:solicitud", aceptarAmigo)

router.post("/agregar-amigo", agregarAmigo)

export default router;
