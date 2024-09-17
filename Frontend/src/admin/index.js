import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// components
import Navbar from "./components/Navbars";
import Sidebar from "./components/Sidebar";
import HeaderStats from "./components/HeaderStats";
import Footer from "./components/Footer";

// views
import Dashboard from "./Pages/Dashboard";
import Product from "./Pages/Product";
// import Maps from "views/admin/Maps.js";
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
                        <Route path="caterogy_product" element={<Product />} />
                        <Route path="/admin/settings" />
                        <Route path="/admin/tables" />
                        <Route path="/" element={<Navigate to="/admin/dashboard" />} />
                    </Routes>
                    <Footer />
                </div>
            </div>
        </>
    );
}
