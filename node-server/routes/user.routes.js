import { Router } from "express";
import {iniciarSesion, registrarUsuario, verificarCuenta, verificarToken} from "../controllers/user.controller.js"

const router = Router();

// Rutas inicio de sesión y registro
router.post("/iniciar-sesion", iniciarSesion);
router.post("/verificar-cuenta", verificarCuenta);
router.get("/verificar-token", verificarToken);
router.post("/registrar-usuario", registrarUsuario);



export default router;
