import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// components
import Navbar from "./components/Navbars";
import Sidebar from "./components/Sidebar";
import HeaderStats from "./components/HeaderStats";
import Footer from "./components/Footer";

// views
import Dashboard from "./Pages/Dashboard";

//Product
import Product from "./Pages/Product/List";
import ProductDetail from "./Pages//Product/ProductDetail";
import AddProduct from "./Pages/Product/Add";
import EditProduct from "./Pages/Product/Edit";

//CategoryProduct
import ProductCategory from "./Pages/ProductCategory/List";
import AddProductCategory from "./Pages/ProductCategory/Add";
import EditProductCaterogy from "./Pages/ProductCategory/Edit";

//User
import UserList from "./Pages/User/List";

import Blog from "./Pages/Blog/List";
import Brand from "./Pages/Brand/List";
import Comment from "./Pages/Comment/List";
import Role from "./Pages/Role/List";
import Order from "./Pages/Order";

import BlogCaterogy from "./Pages/BlogCategory/List";






import AddBlogCategory from "./Pages/BlogCategory/Add";
import EditBlogCategory from "./Pages/BlogCategory/Edit";


import EditBrand from "./Pages/Brand/Edit";
import AddBrand from "./Pages/Brand/Add";

import AddRole from "./Pages/Role/Add";
import EditRole from "./Pages/Role/Edit";

import AddBlog from "./Pages/Blog/Add";
import EditBlog from "./Pages/Blog/Edit";

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
                        <Route path="product/add" element={<AddProduct />} />
                        <Route path="product/edit/:id" element={<EditProduct />} />
                        <Route path="product/detail/:id" element={<ProductDetail />} />

                        <Route path="user" element={<UserList />} />

                        <Route path="category_blog" element={<BlogCaterogy />} />
                        <Route path="category_blog/add" element={<AddBlogCategory />} />
                        <Route path="category_blog/edit/:id" element={<EditBlogCategory />} />

                        <Route path="blog" element={<Blog />}/>
                        <Route path="blog/add" element={<AddBlog />}/>
                        <Route path="blog/edit/:id" element={<EditBlog />}/>



                        <Route path="brand" element={<Brand />}/>
                        <Route path="brand/add" element={<AddBrand />}/>
                        <Route path="brand/edit/:id" element={<EditBrand />}/>



                        <Route path="comment" element={<Comment />}/>
                        <Route path="order" element={<Order />}/>
                        <Route path="role" element={<Role />}/>
                        <Route path="role/add" element={<AddRole />}/>
                        <Route path="role/edit/:id" element={<EditRole />}/>
                        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </>
    );
}
