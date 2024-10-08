import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import {CartProvider} from './components/Cart';
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Products from "./Pages/Products";
import ProductDetail from "./Pages/ProductDetail";
import Header from "./components/Header";


export default function Client() {
    return (
        <CartProvider>
            <Header/>
            <div className="container my-4">

                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:id" element={<ProductDetail/>}/>
                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </div>
            <Footer/>
        </CartProvider>
    );
}
