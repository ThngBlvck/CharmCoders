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
import Profile from "./Pages/Profile";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import ForgotPassword from "./Pages/Forgot_PW";
import Ordered from "./Pages/OrderManagement";
import Post from "./Pages/Post";
import PostDetail from "./Pages/PostDetail";
import OrderManagement from "./Pages/OrderManagement";
import OrderHistory from "./Pages/OrderHistory";


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
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/checkout" element={<Checkout/>} />
                    <Route path="/register" element={<Register/>} />
                    <Route path="/login" element={<Login/>} />
                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/ordered" element={<Ordered/>} />
                    <Route path="/order-detail" element={<OrderManagement/>} />
                    <Route path="/order-history" element={<OrderHistory/>} />
                    <Route path="/post" element={<Post/>} />
                    <Route path="/postdetail" element={<PostDetail/>} />

                    <Route path="/" element={<Navigate to="/home" />} />
                </Routes>
            </div>
            <Footer/>
        </CartProvider>
    );
}
