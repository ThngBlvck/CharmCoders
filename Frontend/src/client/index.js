import React from "react";
import {Routes, Route, Navigate,useLocation} from "react-router-dom";
import {CartProvider} from './components/Cart';
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
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
import Edit_Profile from "./Pages/Edit_Profile";
import Add_Address from "./Pages/Address/Add_Address";
import Edit_Address from "./Pages/Address/Edit_Address";
import ChangePassword from "./Pages/Change_Password";
import ChangePhone from "./Pages/ChangePhone";
import GoogleCallback from "./Pages/GoogleCallback";
import OrderDetail from "./Pages/Order_Detail";
import FacebookCallback from "./Pages/FacebookCallback";
import {ToastContainer} from "react-toastify";
import PaymentResult from "./Pages/payment-result";

import "../assets/styles/css/bootstrap.min.css"
import "../assets/styles/css/style.css"
import "../assets/styles/css/productdt/index.css"



export default function Client() {
    const isAuthenticated = () => localStorage.getItem('token') !== null;
    const location = useLocation();
    const is404Page = location.pathname === "/404";

    return (
        <CartProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            {!is404Page && <Header />}
            <div className="container my-4">
                <Routes>
                    <Route path="/home" element={<Home/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/products" element={<Products/>}/>
                    <Route path="/products/:id" element={<ProductDetail/>}/>
                    <Route path="/profile" element={<Profile/>}/>
                    <Route path="/change_password" element={<ChangePassword/>}/>
                    <Route path="/edit-profile" element={<Edit_Profile/>}/>
                    <Route path="/cart" element={<Cart/>}/>
                    <Route path="/checkout" element={<Checkout/>} />

                    {/* Chặn truy cập vào đăng ký và đăng nhập nếu đã đăng nhập */}
                    <Route path="/register" element={isAuthenticated() ? <Navigate to="/home" /> : <Register/>} />
                    <Route path="/login" element={isAuthenticated() ? <Navigate to="/home" /> : <Login/>} />

                    <Route path="/forgot-password" element={<ForgotPassword/>}/>
                    <Route path="/otp-password" element={<VerifyOtp/>}/>
                    <Route path="/ordered" element={<Ordered/>} />
                    <Route path="/order/:id" element={<OrderDetail/>} />
                    <Route path="/order-list" element={<OrderManagement/>} />
                    <Route path="/order-history" element={<OrderHistory/>} />
                    <Route path="/post" element={<Post/>} />
                    <Route path="/postdetail/:id" element={<PostDetail/>} />
                    <Route path="/404" element={<Page404/>} />
                    <Route path="/auth/google" element={isAuthenticated() ? <Navigate to="/home" />:<GoogleCallback />}></Route>
                    <Route path="/auth/facebook" element={isAuthenticated() ? <Navigate to="/home" />:<FacebookCallback />}></Route>

                    <Route path="/add-address" element={<Add_Address/>} />
                    <Route path="/edit-address/:id" element={<Edit_Address/>} />

                    <Route path="/edit_phone" element={<ChangePhone/>} />



                    <Route path="/payment-result" element={<PaymentResult/>} />

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
