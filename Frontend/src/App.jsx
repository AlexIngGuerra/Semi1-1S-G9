import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, Routes } from "react-router-dom";
import Navigation from './Components/Navbar/Navbar';
import Login from './Components/Login/Login';
import Confirmation from './Components/Register/Confirmation';
import Registro from './Components/Register/Register';
import Home from './Components/Home/Home';

function App() {
  return (
    <div>
      <Navigation/>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Registro/>} />
        <Route path="/confirm" element={<Confirmation/>} />
        <Route path="/home" element={<Home/>} />
        
      </Routes>
    </div>
  )
}

export default App
