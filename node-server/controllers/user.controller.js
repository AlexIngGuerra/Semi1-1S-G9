import {crearToken, validarToken} from "../services/jwt.service.js";
import { v4 as uuidv4 } from 'uuid';
import md5 from "md5";
import {pool} from "../config/configDB.js";
import {loginCognito, registrarCognito, verificarEmail, cuentaActiva} from "../services/cognito.service.js";
import {guardarFoto, obtenerFotoS3} from "../services/s3.service.js"
import {compararFotoRK} from "../services/rekognition.service.js"


// Verifica si el token enviado sigue siendo valido
export const verificarToken = async (req, res) => {
    let result = {
        mensaje: "",
        auth: false
    }
    try{
        //Verificar Token
        const user = await validarToken(req.headers["access-token"])
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        //Permitir acceso
        result.mensaje = "Acceso permitido";
        result.auth = true;
        return res.status(200).json(result);  
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}


// Permite registrar un usuario con foto en la plataforma
export const registrarUsuario = async (req, res) => {
    let result = {
        mensaje: "",
        registrado: false
    }

    try{
        const {nombre, dpi, correo, password, nombre_foto, imagen} = req.body;

        // Agregar usuario a Cognito
        const uuid = await registrarCognito(correo, password);
        if (uuid == null){
            result.mensaje = "Error al momento de registrar el usuario";
            return res.status(401).json(result);
        }
        const PathFoto = "Fotos_Perfil/"+uuid+"-"+nombre_foto;

        // Agregar imagen a S3
        const puts3 = await guardarFoto(PathFoto, imagen)
        if(!puts3){
            result.mensaje = "Error: No se pudo cuardar la foto"
            return res.status(500).json(result);
        }

        // Agregar Info a la base de datos
        await pool.query(
            `INSERT INTO Usuario (id, nombre,dpi,correo,password) 
            VALUES ('${uuid}', '${nombre}', '${dpi}', '${correo}', '${md5(password)}');`
            );
        
        
        await pool.query(
            `INSERT INTO FotoPerfil (nombre_foto, url, activa, usuario) 
            VALUES ('${nombre_foto}', '${PathFoto}', 1, '${uuid}');`
            );

        result.mensaje = "Usuario registrado exitosamente.";
        result.registrado = true;
        return res.status(200).json(result);
    }
    catch (error){
        result.mensaje = "Algo ha salido mal";
        console.log(error)
        return res.status(500).json(result);
    }

}

// Verifica la cuenta con el codigo enviado al correo
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

// Permite iniciar sesión en la plataformas
export const iniciarSesion = async (req, res) => {
    let result = {
        mensaje: "",
        nombre: "",
        token: ""
    }

    try{
        const {correo, password} = req.body;

        // Revisamos credenciales con cognito
        const cognitoResult = await loginCognito(correo, password);
        switch(cognitoResult){
            case 0:
                result.mensaje = "Correo y/o contraseña incorrectos.";
                return res.status(401).json(result);
            case -1:
                result.mensaje = "No ha confirmado su usuario, por favor revise su correo.";
                return res.status(401).json(result);
        }

        // Obtenemos el nombre del usuario en la base de datos
        console.log("UUID:"+cognitoResult)
        const [Select] = await pool.query(`SELECT nombre From Usuario WHERE id = '${cognitoResult}';`);

        // Creamos el token de ingreso
        result.nombre = Select[0].nombre;
        result.token = await crearToken(cognitoResult)

        result.mensaje = "Inicio de Sesión Exitoso";
        return res.status(200).json(result);
    }
    catch (error){
        result.mensaje = "Algo ha salido mal";
        console.log(error);
        return res.status(500).json(result);
    }
}


export const iniciarSesionFoto = async (req, res) =>{
    let result = {
        mensaje: "",
        nombre: "",
        token: ""
    }

    try{
        const {imagen} = req.body;

        const [Select] = await pool.query(
            `SELECT usr.id as id, fp.url as url, usr.nombre as nombre, usr.correo as correo
            FROM FotoPerfil fp
            INNER JOIN Usuario usr ON usr.id = fp.usuario
            WHERE fp.activa = 1
            ;`);


        for(let i = 0; i < Select.length; i++){
            const foto = await obtenerFotoS3(Select[i].url);
            const resultRk = await compararFotoRK(foto, imagen);
            if(resultRk){
                if (cuentaActiva(Select[i].correo)){
                    result.nombre = Select[i].nombre
                    result.token = await crearToken(Select[i].id)
                    result.mensaje = "Inicio de Sesión exitoso"
                    return res.status(200).json(result)
                }
            }
        }

        result.message = "Inicio de Sesión Fallido. No existe ninguna cuenta con la Foto."
        return res.status(401).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.message = "Something goes wrong"
        return res.status(500).json(result);
    }
}


