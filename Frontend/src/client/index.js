import React from "react";
import {Routes, Route, Navigate, useLocation} from "react-router-dom";
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
import Page404 from "./Pages/404";
import VerifyOtp from "./Pages/Otp_PW";
import ResetPassword from "./Pages/Confirm_PW";

export default function Client() {
    const isAuthenticated = () => localStorage.getItem('token') !== null;
    const location = useLocation();
    const is404Page = location.pathname === "/404";

    return (
        <CartProvider>
            {!is404Page && <Header />}
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

                    {/* Chặn truy cập vào đăng ký và đăng nhập nếu đã đăng nhập */}
                    <Route path="/register" element={isAuthenticated() ? <Navigate to="/home" /> : <Register/>} />
                    <Route path="/login" element={isAuthenticated() ? <Navigate to="/home" /> : <Login/>} />

                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/otp-password" element={<VerifyOtp/>}/>
                    <Route path="/confirm-password" element={<ResetPassword/>}/>
                    <Route path="/ordered" element={<Ordered/>} />
                    <Route path="/order-detail" element={<OrderManagement/>} />
                    <Route path="/order-history" element={<OrderHistory/>} />
                    <Route path="/post" element={<Post/>} />
                    <Route path="/postdetail/:id" element={<PostDetail/>} />
                    <Route path="/404" element={<Page404/>} />

                    {/* Trang chủ khi vào đường dẫn gốc */}
                    <Route path="/" element={<Navigate to="/home" />} />

                    {/* Chuyển hướng đến 404 khi route không tồn tại */}
                    <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
            </div>
            {!is404Page && <Footer />}
        </CartProvider>
    );
}
