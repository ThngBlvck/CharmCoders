import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../services/User";

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token")); // Kiểm tra xem đã đăng nhập chưa
    const navigate = useNavigate();


    // Hàm xử lý khi người dùng nhấn vào icon tìm kiếm
    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setIsLoggedIn(false); 
            navigate('/login'); 
        } catch (error) {
            console.error("Đăng xuất không thành công:", error);
        }
    };

    return (
        <>
            <div className="container-fluid sticky-top px-0">
                <div className="container-fluid topbar d-none d-lg-block">
                    <div className="container px-0">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="d-flex flex-wrap">
                                    <a href="#" className="me-4 text-light"><i
                                        className="fas fa-map-marker-alt text-primary me-2"></i>Toà nhà FPT Polytechnic,
                                        Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ</a>
                                    <a href="#" className="me-4 text-light"><i
                                        className="fas fa-phone-alt text-primary me-2"></i>+01234567890</a>
                                    <a href="#" className="text-light"><i
                                        className="fas fa-envelope text-primary me-2"></i>glowmakers@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container-fluid px-0">
                    <nav className="navbar navbar-expand-xl bg-light">
                        <NavLink to={`/home`} className="navbar-brand">
                            <p className="text-primary display-4" style={{marginLeft: "100px"}}>GlowMakers</p>
                        </NavLink>
                        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse">
                            <span className="fa fa-bars text-primary"></span>
                        </button>
                        <div className="collapse navbar-collapse py-3" id="navbarCollapse">
                            <div className="navbar-nav mx-auto border-top">
                                <NavLink to={`/home`} className="nav-item nav-link font-semibold">Trang chủ</NavLink>
                                <NavLink to={`/about`} className="nav-item nav-link font-semibold">Giới thiệu</NavLink>
                                <NavLink to={`/products`} className="nav-item nav-link font-semibold">Sản phẩm</NavLink>
                                <NavLink to={`/contact`} className="nav-item nav-link font-semibold">Liên hệ</NavLink>
                                <NavLink to={`/post`} className="nav-item nav-link font-semibold">Bài viết</NavLink>
                            </div>

                            <div className="d-flex align-items-center flex-nowrap pt-xl-0" style={{marginRight: "100px"}}>
                                {/* Tìm kiếm sản phẩm */}
                                <div className="input-group" style={{maxWidth: "400px", position: "relative"}}>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        aria-label="Search"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        style={{
                                            border: "2px solid #ccc",
                                            paddingRight: "50px", // Chỉnh padding để có không gian cho icon
                                            height: "40px"
                                        }}
                                    />
                                    {/* Icon tìm kiếm */}
                                    <span
                                        className="input-group-text bg-transparent border-0"
                                        onClick={handleSearch}
                                        style={{
                                            position: "absolute",
                                            right: "15px", // Đảm bảo vị trí phù hợp trong input
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <i className="fas fa-search" style={{color: "#ff7e6b", fontSize: "1.5rem"}}></i>
                                    </span>
                                </div>

                                {/* Icon giỏ hàng */}
                                <NavLink to={`/cart`} className="btn ms-2"
                                         style={{width: "50px", height: "50px", color: "var(--bs-primary)", position: "relative"}}>
                                    <i className="fas fa-shopping-cart" style={{fontSize: "1.5rem"}}></i>
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
                                         style={{width: "50px", height: "50px", color: "var(--bs-primary)"}}>
                                    <i className="fas fa-user" style={{fontSize: "1.5rem"}}></i>
                                </NavLink>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>

        </>
    );
}
