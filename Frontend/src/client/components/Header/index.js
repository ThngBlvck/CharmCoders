import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../../services/User";

// Danh sách sản phẩm mẫu (thay thế bằng API hoặc dữ liệu thực tế)
const mockProducts = [
    { id: 1, name: "Sản phẩm 1 Sản phẩm 1 Sản phẩm 1", price: 100000, image: "https://via.placeholder.com/50" },
    { id: 2, name: "Sản phẩm 2", price: 200000, image: "https://via.placeholder.com/50" },
    { id: 3, name: "Sản phẩm 3", price: 150000, image: "https://via.placeholder.com/50" },
    { id: 4, name: "Sản phẩm 4", price: 150000, image: "https://via.placeholder.com/50" },
    { id: 5, name: "Sản phẩm 5", price: 150000, image: "https://via.placeholder.com/50" },
];

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]); // Gợi ý sản phẩm
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Thêm trạng thái cho dropdown

    const navigate = useNavigate();

    // Hàm xử lý khi người dùng nhấn vào icon tìm kiếm
    const handleSearch = () => {
        if (searchTerm.trim()) {
            navigate(`/search?query=${searchTerm}`);
        }
    };

    // Tạo ra hàm fuzzy matching
    const fuzzyMatch = (input, target) => {
        // Chuyển tất cả về dạng lowercase để so sánh không phân biệt chữ hoa/chữ thường
        const searchTerms = input.toLowerCase().split(" ");
        const targetLower = target.toLowerCase();

        // Kiểm tra xem tất cả các từ trong searchTerm có nằm trong target hay không
        return searchTerms.every(term => targetLower.includes(term));
    };

    // Cập nhật từ khóa và gợi ý sản phẩm mỗi khi người dùng nhập
    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Lọc sản phẩm phù hợp với từ khóa tìm kiếm (không cần trùng hoàn toàn)
        const filteredProducts = mockProducts
            .filter(product =>
                fuzzyMatch(value, product.name)  // Sử dụng hàm fuzzy matching
            )
            .slice(0, 4); // Giới hạn tối đa 4 sản phẩm

        setSuggestions(filteredProducts);
    };

    const handleLogout = () => {
        logout()
            .then(() => {
                localStorage.removeItem("token");

                navigate("/login");
            })
            .catch(err => {
                console.error("Đăng xuất thất bại:", err);
            });
    };

    // Hàm để mở hoặc đóng dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen(prevState => !prevState);
    };

    return (
        <>
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
            <div className="container-fluid sticky-top px-0">
                <div className="container-fluid px-0">
                    <nav className="navbar navbar-expand-xl bg-light">
                        <NavLink to={`/home`} className="navbar-brand"  onClick={() => window.scrollTo(0, 0)}>
                            <p className="text-primary display-5" style={{ marginLeft: "100px" }}>GlowMakers</p>
                        </NavLink>
                        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarCollapse">
                            <span className="fa fa-bars text-primary"></span>
                        </button>
                        <div className="collapse navbar-collapse py-3" id="navbarCollapse">
                            <div className="navbar-nav mx-auto border-top">
                                <NavLink to={`/home`} className="nav-item nav-link font-semibold"  onClick={() => window.scrollTo(0, 0)}>Trang chủ</NavLink>
                                <NavLink to={`/about`} className="nav-item nav-link font-semibold"  onClick={() => window.scrollTo(0, 0)}>Giới thiệu</NavLink>
                                <NavLink to={`/products`} className="nav-item nav-link font-semibold"  onClick={() => window.scrollTo(0, 0)}>Sản phẩm</NavLink>
                                <NavLink to={`/contact`} className="nav-item nav-link font-semibold"  onClick={() => window.scrollTo(0, 0)}>Liên hệ</NavLink>
                                <NavLink to={`/post`} className="nav-item nav-link font-semibold"  onClick={() => window.scrollTo(0, 0)}>Bài viết</NavLink>
                            </div>

                            <div className="d-flex align-items-center flex-nowrap pt-xl-0"
                                 style={{ marginRight: "100px" }}>
                                {/* Tìm kiếm sản phẩm */}
                                <div className="input-group" style={{ maxWidth: "400px", position: "relative" }}>
                                    <input
                                        type="text"
                                        className="form-control rounded-pill"
                                        placeholder="Tìm kiếm sản phẩm..."
                                        aria-label="Search"
                                        value={searchTerm}
                                        onChange={handleInputChange} // Gọi hàm khi người dùng nhập
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        style={{
                                            border: "2px solid #ccc",
                                            paddingRight: "50px",
                                            height: "40px"
                                        }}
                                    />
                                    {/* Icon tìm kiếm */}
                                    <span
                                        className="input-group-text bg-transparent border-0"
                                        onClick={handleSearch}
                                        style={{
                                            position: "absolute",
                                            right: "15px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer"
                                        }}
                                    >
                                        <i className="fas fa-search" style={{ color: "#ff7e6b", fontSize: "1.5rem" }}></i>
                                    </span>

                                    {/* Dropdown gợi ý sản phẩm */}
                                    {searchTerm && suggestions.length > 0 && (
                                        <div
                                            className="dropdown-menu search-menu show"
                                            style={{
                                                position: "absolute",
                                                top: "100%",
                                                left: "0",
                                                right: "0",
                                                maxHeight: "300px",
                                                overflowY: "auto",
                                                zIndex: 1000
                                            }}
                                        >
                                            {suggestions.map((product) => (
                                                <NavLink
                                                    key={product.id}
                                                    to={`/products/:id`}
                                                    className="dropdown-item search-item"
                                                    onClick={() => setSearchTerm("")}
                                                    // Reset lại thanh tìm kiếm khi click
                                                >
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        style={{
                                                            width: "50px",
                                                            height: "50px",
                                                            objectFit: "cover",
                                                            marginRight: "10px"
                                                        }}
                                                    />
                                                    <div>
                                                        <p className="product-n" style={{
                                                            fontWeight: "bold"
                                                        }}>{product.name}</p>
                                                        <small>{product.price.toLocaleString()} VND</small>
                                                    </div>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Icon giỏ hàng */}
                                <NavLink to={`/cart`} className="btn ms-2"  onClick={() => window.scrollTo(0, 0)}
                                         style={{
                                             width: "50px",
                                             height: "50px",
                                             color: "var(--bs-primary)",
                                             position: "relative"
                                         }}>
                                    <i className="fas fa-shopping-basket" style={{ fontSize: "1.5rem" }}></i>
                                    <span
                                        className="font-bold"
                                        style={{
                                            position: "absolute",
                                            top: "-5px",
                                            right: "-4px",
                                            padding: "0.1rem 0.4rem",
                                            backgroundColor: "#442e2b",
                                            border: "solid 1px #ff7e6b",
                                            borderRadius: "100%",
                                            color: "white",
                                            fontSize: "0.8rem",
                                        }}
                                    >
                                         3
                                    </span>
                                </NavLink>

                                {/* Dropdown tài khoản */}
                                <div className="dropdown ms-2"
                                     onMouseEnter={() => setIsDropdownOpen(true)} // Hiện dropdown khi hover
                                     onMouseLeave={() => setIsDropdownOpen(false)} // Ẩn dropdown khi không hover
                                >
                                    <button
                                        className="btn"
                                        type="button"
                                        id="dropdownMenuButton"
                                        aria-expanded={isDropdownOpen}
                                        style={{ width: "50px", height: "50px", color: "var(--bs-primary)" }}
                                    >
                                        <i className="fas fa-user" style={{ fontSize: "1.5rem" }}></i>
                                    </button>
                                    {/* Dropdown menu */}
                                    {isDropdownOpen && (
                                        <ul className="dropdown-menu show" aria-labelledby="dropdownMenuButton" style={{ left: "-68px", top: "40px" }}>
                                            <li>
                                                <NavLink to="/profile" onClick={() => {setIsDropdownOpen(false); window.scrollTo(0, 0)}} >
                                                    <button className="dropdown-item modal-item" style={{ color: "#8c5e58" }}>
                                                        <i className="fas fa-user me-2"></i>Tài khoản của bạn
                                                    </button>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/order-detail" onClick={() => {setIsDropdownOpen(false); window.scrollTo(0, 0)}}>
                                                    <button className="dropdown-item modal-item" style={{ color: "#8c5e58" }}>
                                                        <i className="fas fa-file-alt me-2"></i>Quản lý đơn hàng
                                                    </button>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/order-history" onClick={() => {setIsDropdownOpen(false); window.scrollTo(0, 0)}}>
                                                    <button className="dropdown-item modal-item" style={{ color: "#8c5e58" }}>
                                                        <i className="fas fa-clock-rotate-left me-2"></i>Lịch sử đơn hàng
                                                    </button>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="" onClick={() => {
                                                    // Logic cho nút thoát
                                                    toggleDropdown();
                                                }}>
                                                    <button className="dropdown-item modal-item"
                                                        onClick={handleLogout}
                                                        style={{ color: "#8c5e58" }}>
                                                        <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                                                    </button>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
