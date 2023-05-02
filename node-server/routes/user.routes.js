import { Router } from "express";
import {getDatosPerfil, iniciarSesion, iniciarSesionFoto, modificarDatos, registrarUsuario, verificarCuenta, verificarToken} from "../controllers/user.controller.js"

const router = Router();

// Rutas inicio de sesión y registro
router.post("/iniciar-sesion", iniciarSesion);
router.post("/verificar-cuenta", verificarCuenta);
router.get("/verificar-token", verificarToken);
router.post("/registrar-usuario", registrarUsuario);
router.post("/iniciar-sesion-foto", iniciarSesionFoto);
router.get("/get-info-perfil", getDatosPerfil);
router.post("/modificar-datos", modificarDatos);

export default router;
