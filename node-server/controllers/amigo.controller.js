import {pool} from "../config/configDB.js";
import {validarToken} from "../services/jwt.service.js";


export const listadoDesconocidos = async (req, res) => {
    let result = {
        mensaje: "",
        usuarios: []
    }

    try{
        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        const [Select] = await pool.query(
            `SELECT usr.id, usr.nombre FROM Usuario usr
            WHERE (SELECT Count(*) FROM Amigo am WHERE am.usuario1 = usr.id OR usuario2 = usr.id) < 1
            AND NOT usr.id = '${user.id}';`);

        result.mensaje = "Usuarios obtenidos correctamente"
        result.usuarios = Select
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

export const agregarAmigo = async (req, res) => {
    let result = {
        mensaje: "",
        agregado: false
    }

    try{
        const {usuario} = req.body

        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        await pool.query(
            `INSERT INTO Amigo (usuario1, usuario2, estado)
            VALUES ('${user.id}', '${usuario}', 0) `);

        result.mensaje = "Solicitud enviada correctamente"
        result.agregado = true
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

export const aceptarAmigo = async (req, res) => {

}

export const rechazarAmigo = async (req, res) => {

}