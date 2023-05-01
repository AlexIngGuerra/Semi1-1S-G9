import { Router } from "express";
import {agregarAmigo, listadoDesconocidos} from "../controllers/amigo.controller.js"

const router = Router();

router.get("/listar-desconocidos", listadoDesconocidos)


router.post("/agregar-amigo", agregarAmigo)

export default router;
