import { Router } from "express";
import {iniciarSesion, verificarToken} from "../controllers/user.controller.js"

const router = Router();

router.post("/iniciar-sesion", iniciarSesion);
router.get("/verificar-token", verificarToken);

export default router;
