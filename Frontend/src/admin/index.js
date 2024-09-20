import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// components
import Navbar from "./components/Navbars";
import Sidebar from "./components/Sidebar";
import HeaderStats from "./components/HeaderStats";
import Footer from "./components/Footer";

// views
import Dashboard from "./Pages/Dashboard";
import Product from "./Pages/Product/List";
import ProductCategory from "./Pages/ProductCategory/List";
import Blog from "./Pages/Blog";
// import Brand from "./Pages/Brand";
import Comment from "./Pages/Comment";
import Order from "./Pages/Order";
import BlogCaterogy from "./Pages/BlogCategory/List";
import AddProductCategory from "./Pages/ProductCategory/Add";
import EditProductCaterogy from "./Pages/ProductCategory/Edit";

import AddBlogCategory from "./Pages/BlogCategory/Add";
import EditBlogCategory from "./Pages/BlogCategory/Edit";


import EditProductCaterogy from "./Pages/ProductCategory/Edit";
// import Settings from "views/admin/Settings.js";
// import Tables from "views/admin/Tables.js";

export default function Admin() {
    return (
        <>
            <Sidebar />
            <div className="relative md:ml-64 bg-blueGray-100">
                <Navbar />
                {/* Header */}
                <HeaderStats />
                <div className="px-4 md:px-10 mx-auto w-full -m-24">
                    <Routes>
                        <Route path="dashboard" element={<Dashboard />} />

                        <Route path="category_product" element={<ProductCategory />} />
                        <Route path="category_product/add" element={<AddProductCategory />} />
                        <Route path="category_product/edit/:id" element={<EditProductCaterogy />} />

                        <Route path="product" element={<Product />} />
                        {/*<Route path="user" element={<User />} />*/}
                        <Route path="category_blog" element={<BlogCaterogy />} />
                        <Route path="category_blog/add" element={<AddBlogCategory />} />
                        <Route path="category_blog/edit/:id" element={<EditBlogCategory />} />
                        <Route path="blog" element={<Blog />}/>
                        {/*<Route path="brand" element={<Brand />}/>*/}
                        <Route path="comment" element={<Comment />}/>
                        <Route path="order" element={<Order />}/>
                        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </>
    );
}
