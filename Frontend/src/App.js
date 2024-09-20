import React from "react";
import Admin from './admin';
import Client from "./client";
import {Routes, Route} from 'react-router-dom';
import './App.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

import "./assets/styles/tailwind.css";
import "./assets/styles/css/style.css";
import "./assets/styles/css/bootstrap.min.css";



const App = () => {
    return (
        <Routes>
            <Route path="/admin/*" element={<Admin/>}></Route>
            <Route path="/*" element={<Client/>}></Route>
        </Routes>
    )
}

export default App;
