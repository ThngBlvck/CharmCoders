import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// components
import Navbar from "./components/Navbars";
import Sidebar from "./components/Sidebar";
import HeaderStats from "./components/HeaderStats";
import Footer from "./components/Footer";

// views
import Dashboard from "./Pages/Dashboard";
import Page404 from "../client/Pages/404";
import Login from "./Pages/Login";

// Product
import Product from "./Pages/Product/List";
import ProductDetail from "./Pages/Product/ProductDetail";
import AddProduct from "./Pages/Product/Add";
import EditProduct from "./Pages/Product/Edit";

// CategoryProduct
import ProductCategory from "./Pages/ProductCategory/List";
import AddProductCategory from "./Pages/ProductCategory/Add";
import EditProductCaterogy from "./Pages/ProductCategory/Edit";

// User
import UserList from "./Pages/User/List";
import AddEmployee from "./Pages/User/Add";
import EditEmployee from "./Pages/User/Edit";

// Blog and BlogCategory
import Blog from "./Pages/Blog/List";
import BlogCaterogy from "./Pages/BlogCategory/List";
import AddBlogCategory from "./Pages/BlogCategory/Add";
import EditBlogCategory from "./Pages/BlogCategory/Edit";
import AddBlog from "./Pages/Blog/Add";
import EditBlog from "./Pages/Blog/Edit";

// Brand
import Brand from "./Pages/Brand/List";
import AddBrand from "./Pages/Brand/Add";
import EditBrand from "./Pages/Brand/Edit";

import Banner from "./Pages/Banner/List";
import AddBanner from "./Pages/Banner/Add";
import EditBanner from "./Pages/Banner/Edit";

// Other sections
import Comment from "./Pages/Comment/List";
import Role from "./Pages/Role/List";
import Order from "./Pages/Order/List";
import OrderDetail from "./Pages/Order/OrderDetail";
import EditOrder from "./Pages/Order/Edit";
import AddRole from "./Pages/Role/Add";
import EditRole from "./Pages/Role/Edit";
import Reviews from "./Pages/Review/List";
import "../assets/styles/tailwind.css"

export default function Admin() {
    const location = useLocation();
    const isLoginPage = location.pathname === "/admin/login";

    return (
        <>
            {!isLoginPage && <Sidebar />}
            <div className={`relative ${!isLoginPage ? "md:ml-64 bg-blueGray-100" : "bg-white"}`}>
                {!isLoginPage && <Navbar />}
                {!isLoginPage && <HeaderStats />}
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="login" element={<Login />} />
                        {/* Product Category Routes */}
                        <Route path="category_product" element={<ProductCategory />} />
                        <Route path="category_product/add" element={<AddProductCategory />} />
                        <Route path="category_product/edit/:id" element={<EditProductCaterogy />} />

                        {/* Product Routes */}
                        <Route path="product" element={<Product />} />
                        <Route path="product/add" element={<AddProduct />} />
                        <Route path="product/edit/:id" element={<EditProduct />} />
                        <Route path="product/detail/:id" element={<ProductDetail />} />

                        {/* User Routes */}
                        <Route path="user" element={<UserList />} />
                        <Route path="user/add" element={<AddEmployee />} />
                        <Route path="user/edit/:id" element={<EditEmployee />} />

                        {/* Blog Category Routes */}
                        <Route path="category_blog" element={<BlogCaterogy />} />
                        <Route path="category_blog/add" element={<AddBlogCategory />} />
                        <Route path="category_blog/edit/:id" element={<EditBlogCategory />} />

                        {/* Blog Routes */}
                        <Route path="blog" element={<Blog />} />
                        <Route path="blog/add" element={<AddBlog />} />
                        <Route path="blog/edit/:id" element={<EditBlog />} />

                        {/* Brand Routes */}
                        <Route path="brand" element={<Brand />} />
                        <Route path="brand/add" element={<AddBrand />} />
                        <Route path="brand/edit/:id" element={<EditBrand />} />

                        {/* Other Routes */}
                        <Route path="comment" element={<Comment />} />
                        <Route path="order" element={<Order />} />
                        <Route path="order/edit/:id" element={<EditOrder />} />
                        <Route path="order/detail/:id" element={<OrderDetail />} />

                        <Route path="role" element={<Role />} />
                        <Route path="role/add" element={<AddRole />} />
                        <Route path="role/edit/:id" element={<EditRole />} />

                        <Route path="banner" element={<Banner />} />
                        <Route path="banner/add" element={<AddBanner />} />
                        <Route path="banner/edit/:id" element={<EditBanner />} />

                        <Route path="review" element={<Reviews />} />

                        {/* Default and 404 Route */}
                        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                        <Route path="/404" element={<Page404 />} />
                        <Route path="*" element={<Navigate to="/404" />} />
                    </Routes>
                    {!isLoginPage && <Footer />}
                </div>
            </div>
        </>
    );
}
