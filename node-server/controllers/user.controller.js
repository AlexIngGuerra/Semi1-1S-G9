import {crearToken, validarToken} from "../services/jwt.service.js";

export const iniciarSesion = async (req, res) => {
    let result = {
        mensaje: "",
        token: ""
    }

    try{
        const usuario = req.body;
        result.token = await crearToken(usuario);
        
        result.mensaje = "Inicio de Sesión Exitoso";
        return res.status(200).json(result);
    }
    catch (error){
        result.mensaje = "Something goes wrong";
        return res.status(500).json(result);
    }
}

export const verificarToken = async (req, res) => {
    let result = {
        mensaje: "",
        auth: 0
    }
    const token = req.headers["access-token"];
    const user = await validarToken(token)
    
    //Denegar Acceso
    if (user == null){
        result.mensaje = "Acceso Denegado"
        res.status(200).json(result)
    }
    
    //Permitir acceso
    result.mensaje = "Acceso permitido";
    result.auth = 1;
    res.status(200).json(result);
}