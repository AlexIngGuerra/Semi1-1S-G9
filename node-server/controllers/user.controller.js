import {crearToken, validarToken} from "../services/jwt.service.js";
import { v4 as uuidv4 } from 'uuid';
import md5 from "md5";
import {loginCognito, registrarCognito, verificarEmail} from "../services/cognito.service.js"

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
        res.status(401).json(result)
    }
    
    //Permitir acceso
    result.mensaje = "Acceso permitido";
    result.auth = 1;
    res.status(200).json(result);
}

export const registrarUsuario = async (req, res) => {
    let result = {
        mensaje: "",
        registrado: false
    }

    try{
        const {nombre, dpi, correo, password, nombre_foto, imagen} = req.body;

        const uuid = await registrarCognito(correo, password);
        if (uuid == null){
            result.mensaje = "Error al momento de registrar el usuario";
            return res.status(401).json(result);
        }

        result.mensaje = "Usuario registrado exitosamente.";
        result.registrado = true;
        return res.status(200).json(result);
    }
    catch (error){
        result.mensaje = "Algo ha salido mal";
        return res.status(500).json(result);
    }

}

export const verificarCuenta = async (req, res) =>{
    let result = {
        mensaje: "",
        confirmado: false
    }

    try{
        const {correo, codigo} = req.body;

        const verificado = await verificarEmail(correo, codigo);
        if (!verificado){
            result.mensaje = "Error no se ha podido confirmar el email."
            return res.status(200).json(result);
        }

        result.mensaje = "Email confirmado correctamente"
        result.confirmado = true;
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

export const iniciarSesion = async (req, res) => {
    let result = {
        mensaje: "",
        nombre: "",
        token: ""
    }

    try{
        const {correo, password} = req.body;

        const cognitoResult = await loginCognito(correo, password);

        switch(cognitoResult){
            case 0:
                result.mensaje = "Correo y/o contraseña incorrectos.";
                return res.status(401).json(result);
            case -1:
                result.mensaje = "No ha confirmado su usuario, por favor revise su correo.";
                return res.status(401).json(result);
        }



        result.mensaje = "Inicio de Sesión Exitoso";
        return res.status(200).json(result);
    }
    catch (error){
        result.mensaje = "Algo ha salido mal";
        console.log(error);
        return res.status(500).json(result);
    }
}



