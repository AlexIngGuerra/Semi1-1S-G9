import { Router } from "express";
import {getFotosPerfil, subirFoto} from "../controllers/publicacion.controller.js"

const router = Router();

router.get("/get-fotos-perfil", getFotosPerfil);

router.post("/subir-foto", subirFoto)

export default router;
