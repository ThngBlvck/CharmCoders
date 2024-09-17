import React from "react";
import Admin from './admin';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/styles/tailwind.css";


const App = () => {
  return (
      <Routes>
        <Route path="/admin/*" element={<Admin/>}></Route>
      </Routes>
  )
}

export default App;
