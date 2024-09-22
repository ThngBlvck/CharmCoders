import React from "react";
import { NavLink } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Giữ lại FontAwesome để sử dụng icon

export default function Navbar() {
    return (
        <>
            <div className="container-fluid bg-light">
                <div className="container px-0">
                    <nav className="navbar navbar-light navbar-expand-xl">
                        <a href="#" className="navbar-brand">
                            <h1 className="text-primary display-4">GlowMakers</h1>
                        </a>
                        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse">
                            <span className="fa fa-bars text-primary"></span>
                        </button>
                        <div className="collapse navbar-collapse bg-light py-3" id="navbarCollapse">
                            <div className="navbar-nav mx-auto border-top">
                                <NavLink to={`/home`} className="nav-item nav-link active">Trang chủ</NavLink>
                                <NavLink to={`/about`} className="nav-item nav-link">Giới thiệu</NavLink>
                                <NavLink to={`/products`} className="nav-item nav-link">Sản phẩm</NavLink>
                                <NavLink to={`/contact`} className="nav-item nav-link">Liên hệ</NavLink>
                                <NavLink to={`/post`} className="nav-item nav-link">Bài viết</NavLink>
                            </div>

                            <div className="d-flex align-items-center flex-nowrap pt-xl-0">
                                {/* Tìm kiếm sản phẩm */}
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    aria-label="Search"
                                />
                                <button
                                    className="btn-search btn btn-primary btn-primary-outline-0 rounded-circle btn-lg-square"
                                    data-bs-toggle="modal" data-bs-target="#searchModal"
                                    style={{ fontSize: "1.8rem", color: "var(--bs-primary)", position: "relative" }}
                                >
                                    <i className="fas fa-search"></i>
                                </button>

                                {/* Icon giỏ hàng */}
                                <NavLink to={`/cart`} className="btn ms-2"
                                         style={{ fontSize: "1.8rem", color: "var(--bs-primary)", position: "relative" }}>
                                    <i className="fas fa-shopping-cart"></i>
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "-5px",
                                            right: "-10px",
                                            padding: "0.3rem 0.5rem",
                                            backgroundColor: "red",
                                            borderRadius: "50%",
                                            color: "white",
                                            fontSize: "0.75rem",
                                        }}
                                    >
                                        3
                                    </span>
                                </NavLink>

                                {/* Icon profile */}
                                <NavLink to={`/profile`} className="btn ms-2"
                                         style={{ fontSize: "1.8rem", color: "var(--bs-primary)" }}>
                                    <i className="fas fa-user"></i>
                                </NavLink>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
