import {pool} from "../config/configDB.js";
import {URL_S3} from "../config/configS3.js"
import {guardarFoto, obtenerFotoS3, } from "../services/s3.service.js"
import {obtenerEtiquetas} from "../services/rekognition.service.js"
import {validarToken} from "../services/jwt.service.js";

// FUNCION PARA OBETENER LAS FOTOS DE PERFIL DE UN Usuario
export const getFotosPerfil = async (req, res) => {
    let result = {
        mensaje: "",
        fotos: []
    }

    try{
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        let [Select] = await pool.query(`SELECT * FROM FotoPerfil Where usuario = '${user.id}';`);

        result.fotos = Select.map( (item) => {
            item.url = URL_S3 + item.url
            return item
        })

        console.log(user.id)

        result.mensaje = "Fotos de perfil obtenidas correctamente"
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}

// Funcion para subir una foto
export const subirFoto = async (req, res) =>{
    let result = {
        mensaje: "",
        subida: false
    }

    try{
        const {nombre_foto, descripcion, imagen} = req.body;

        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        const PathFoto = "Fotos_Publicadas/"+user.id+"-"+nombre_foto;

        // Revisar etiquetas de la foto
        let etiquetas = await obtenerEtiquetas(imagen)
        if(etiquetas.length<1){
            retorno.message = "Error: no se pudieron obtener etiquetas para la foto."
            return res.status(500).json(retorno);
        }

        // Agregar imagen a S3
        const puts3 = await guardarFoto(PathFoto, imagen)
        if(!puts3){
            return res.status(500).json({ message: "Error: No se ha podido subir la imagen." });
        }

        // Verificamos las etiquetas y las insertamos
        let [query] = await pool.query(`Select Nombre From Etiqueta`);
        for(let e = 0; e < etiquetas.length; e++){
            let insertar = true;
            for(let i = 0; i < query.length; i++){
                if (query[i].Nombre == etiquetas[e]) insertar = false;
            }
            if(insertar) await pool.query(`Insert Into Etiqueta (nombre) Values ('${etiquetas[e]}');`);
        }

        // Insertamos la foto en la db
        await pool.query(
            `INSERT INTO Publicacion (nombre_foto, url_foto, descripcion, usuario) 
            VALUES ('${nombre_foto}', '${PathFoto}', '${descripcion}', '${user.id}');`);

        //Creamos la relación con las etiquetas
        for(let e = 0; e < etiquetas.length; e++){
            await pool.query(
                `INSERT INTO Publicacion_Etiqueta(publicacion , etiqueta) 
                VALUES ((Select id from Publicacion Where url_foto = '${PathFoto}'), (Select id from Etiqueta where  nombre='${etiquetas[e]}'));`);
        }


        result.mensaje = "Imagen subida de manera exitosa"
        result.subida = true
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}


// 
export const obtenerPublicaciones = async (req, res) =>{
    let result = {
        mensaje: "",
    }

    try{
        //Verificar token
        const user = await validarToken(req.headers["access-token"]);
        if (user == null){
            result.mensaje = "Acceso Denegado"
            return res.status(401).json(result)
        }

        result.mensaje = ""
        return res.status(200).json(result);
    }
    catch (error) {//Error si algo sale mal
        console.log(error)
        result.mensaje = "Algo ha salido mal"
        return res.status(500).json(result);
    }
}