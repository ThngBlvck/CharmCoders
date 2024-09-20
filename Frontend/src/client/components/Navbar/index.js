import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


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
                                <a href="#" className="nav-item nav-link active">Trang chủ</a>
                                <a href="#" className="nav-item nav-link">Giới thiệu</a>
                                <a href="#" className="nav-item nav-link">Sản phẩm</a>
                                <a href="#" className="nav-item nav-link">Liên hệ</a>
                            </div>
                            <div className="d-flex align-items-center flex-nowrap pt-xl-0">
                                <input
                                    type="text"
                                    className="form-control me-2"
                                    placeholder="Tìm kiếm sản phẩm..."
                                    aria-label="Search"
                                />
                                <button
                                    className="btn-search btn btn-primary btn-primary-outline-0 rounded-circle btn-lg-square"
                                    data-bs-toggle="modal" data-bs-target="#searchModal">
                                    <i className="fas fa-search"></i>
                                </button>
                            </div>

                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}