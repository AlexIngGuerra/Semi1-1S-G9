import React, { useState,useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import config from "../../config.js";
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';


function Home() {

  let navigate = useNavigate();
  const [labels, setLabels] = useState([]);
  const [publicaciones, setPublicaciones] = useState([]);
  
  useEffect(() => {
    
    const userId = localStorage.getItem('userId');
    if (userId===null){
      return navigate("/login");
    } 

    console.log(`${config.apiUrl}/get-publicacion-todo`)
    fetch(`${config.apiUrl}/get-publicacion-todo`,config.requestOptionsGET)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data)
      setPublicaciones(data.publicaciones)
    }) 
    .catch((error) => console.error(error.message));


    console.log(`${config.apiUrl}/get-etiquetas`)
    fetch(`${config.apiUrl}/get-etiquetas`,config.requestOptionsGET)
    .then(response => {
        if (!response.ok) {
            console.error(response.statusText);
        }
        return response.json();
    })
    .then((data) => {
      console.log(data)
      setLabels(data.etiquetas)
    }) 
    .catch((error) => console.error(error.message));

  }, []);

  if (publicaciones.length === 0) {
    return (
      <div style={{padding:20}}>
      <Form.Group>
        <Form.Label htmlFor="labels">Buscar por etiqueta</Form.Label>
        <Form.Control 
          list="labels" 
          id="exampleDataList" 
          placeholder="Ingrese una etiqueta..."
        />
        <datalist id="labels">
          <option value="Todos" key="-1" />
          {labels.map((pub) => ( 
            <option value={pub.nombre} key={pub.id} />
          ))}
        </datalist>
      </Form.Group>


        <h1 className="h4 text-center text-primary" style={{padding:20}}>
          No hay publicaciones por mostrar.
        </h1>
      </div>
    )
  }
    return(    
        <>  
        <div style={{padding:'3% 0 0 0'}}>
          {publicaciones.map((pub,index) => ( 
              <div className="row" key={index} style={{padding:'2% 25% 15px 25%'}}>
                <Card className="border-secondary">
                <Card.Body>
                    <Card.Title>{pub.nombre_foto}</Card.Title>
                      <img src={pub.url_foto} className='imgPub'/>
                    <Card.Text>
                      {pub.descripcion}
                    </Card.Text>
                </Card.Body>
                </Card>
              </div>
          ))}
          </div>        
        </>
    )
 
  }
  
  export default Home
  