import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {Link, NavLink, useNavigate} from "react-router-dom";
import { logout } from "../../../services/User";
import { getCart } from "../../../services/Cart";
import {getProduct, searchProduct} from "../../../services/Product";
import { googleLogout } from '@react-oauth/google';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]); // Gợi ý sản phẩm
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Thêm trạng thái cho dropdown
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [cartUpdated, setCartUpdated] = useState(false);

    const navigate = useNavigate();

    const fetchProducts = async () => {
        try {
            let result;
            if (searchTerm.trim() === "") {
                result = await getProduct();
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm);
                result = await searchProduct(sanitizedSearchTerm);
            }

            if (Array.isArray(result)) {
                setProducts(result);
                return result; // Trả về danh sách sản phẩm
            } else if (result && result.products && Array.isArray(result.products)) {
                setProducts(result.products);
                return result.products; // Trả về danh sách sản phẩm
            } else {
                setProducts([]);
                return []; // Trả về mảng rỗng nếu không có sản phẩm
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            setProducts([]);
            return []; // Trả về mảng rỗng nếu xảy ra lỗi
        }
    };


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true); // Nếu có token, thiết lập là đã đăng nhập
            fetchCartCount();
        }

        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 300); // 300ms để chờ trước khi fetch lại sản phẩm

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, cartUpdated]);

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

        // Lọc sản phẩm dựa trên từ khóa tìm kiếm
        if (value.trim()) {
            const filteredProducts = products
                .filter(product => fuzzyMatch(value, product.name)) // Sử dụng fuzzy matching
                .slice(0, 4); // Giới hạn tối đa 4 sản phẩm

            setSuggestions(filteredProducts);
        } else {
            setSuggestions([]); // Xóa gợi ý khi từ khóa rỗng
        }
    };

    const fetchCartCount = async () => {
        try {
            const cart = await getCart(); // Lấy giỏ hàng
            console.log(cart); // Kiểm tra cấu trúc dữ liệu

            // Nhóm các cart theo product_id
            const groupedCart = cart.reduce((acc, item) => {
                const existingItem = acc.find(i => i.product_id === item.product_id);
                if (existingItem) {
                    // Nếu đã tồn tại sản phẩm, chỉ cần cộng thêm số lượng
                    existingItem.quantity += item.quantity;
                } else {
                    // Nếu chưa tồn tại, thêm sản phẩm mới vào nhóm
                    acc.push({ product_id: item.product_id, quantity: item.quantity });
                }
                return acc;
            }, []);

            // Đếm số lượng các cart (số sản phẩm độc nhất)
            const totalCount = groupedCart.length;

            setCartCount(totalCount); // Cập nhật state
        } catch (error) {
            console.error("Lỗi khi lấy số lượng giỏ hàng:", error);
            setCartCount(0); // Đặt lại về 0 nếu có lỗi
        }
    };

    
const handleLogout = () => {
    // Đăng xuất Google
    googleLogout();
    
    // Tiếp tục đăng xuất khỏi hệ thống
    logout()
        .then(() => {
            localStorage.removeItem("token"); // Xóa token
            setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
            setIsDropdownOpen(false); // Đóng dropdown
            navigate("/login"); // Điều hướng đến trang đăng nhập
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
                        <NavLink to={`/home`} className="navbar-brand">
                            <p className="text-primary display-5" style={{ marginLeft: "100px" }}>GlowMakers</p>
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

                            <div className="d-flex align-items-center flex-nowrap pt-xl-0"
                                 style={{marginRight: "100px"}}>
                                {/* Tìm kiếm sản phẩm */}
                                <div className="input-group" style={{maxWidth: "400px", position: "relative"}}>
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
                                            height: "40px",
                                            cursor: 'pointer',
                                            width: '300px',
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
                                        <i className="fas fa-search" style={{color: "#ff7e6b", fontSize: "1.5rem"}}></i>
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
                                                width: "300px",
                                                overflowY: "auto",
                                                zIndex: 1000,
                                            }}
                                        >
                                            {suggestions.map((product) => (
                                                <NavLink
                                                    key={product.id}
                                                    to={`/products/${product.id}`}
                                                    className="dropdown-item search-item"
                                                    onClick={() => setSearchTerm("")} // Reset lại thanh tìm kiếm khi click
                                                >

                                                    <div className="row">
                                                        <div className="col-3">
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
                                                        </div>
                                                        <div className="col-9">
                                                            <p className="product-n" style={{
                                                                fontWeight: "bold",
                                                                overflow: "hidden", // Ẩn phần không hiển thị
                                                                textOverflow: "ellipsis", // Thêm dấu ... nếu dài hơn
                                                                whiteSpace: "normal", // Cho phép xuống dòng
                                                                maxHeight: "3em", // Giới hạn chiều cao để hiển thị 2 dòng
                                                            }}>{product.name.length > 50 ? product.name.substring(0, 50) + "..." : product.name}</p>
                                                            <small>{product.unit_price.toLocaleString()} VND</small>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Icon giỏ hàng */}
                                {isLoggedIn && (
                                    <NavLink to={`/cart`} className="btn ms-2"
                                             style={{
                                                 width: "50px",
                                                 height: "50px",
                                                 color: "var(--bs-primary)",
                                                 position: "relative"
                                             }}>
                                        <i className="fas fa-shopping-basket" style={{fontSize: "1.5rem"}}></i>
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
                                            {cartCount}
                                        </span>
                                    </NavLink>
                                )}

                                {/* Dropdown tài khoản */}
                                {isLoggedIn && (
                                <div className="dropdown ms-2"
                                     onMouseEnter={() => setIsDropdownOpen(true)} // Hiện dropdown khi hover
                                     onMouseLeave={() => setIsDropdownOpen(false)} // Ẩn dropdown khi không hover
                                >
                                    <button
                                        className="btn"
                                        type="button"
                                        id="dropdownMenuButton"
                                        aria-expanded={isDropdownOpen}
                                        style={{width: "50px", height: "50px", color: "var(--bs-primary)"}}
                                    >
                                        <i className="fas fa-user" style={{fontSize: "1.5rem"}}></i>
                                    </button>
                                    {/* Dropdown menu */}
                                    {isDropdownOpen && (
                                        <ul className="dropdown-menu show" aria-labelledby="dropdownMenuButton"
                                            style={{left: "-68px", top: "40px"}}>
                                            <li>
                                                <NavLink to="/profile" onClick={() => setIsDropdownOpen(false)}>
                                                    <button className="dropdown-item modal-item"
                                                            style={{color: "#8c5e58"}}>
                                                        <i className="fas fa-user me-2"></i>Tài khoản của bạn
                                                    </button>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/order-list" onClick={() => setIsDropdownOpen(false)}>
                                                    <button className="dropdown-item modal-item"
                                                            style={{color: "#8c5e58"}}>
                                                        <i className="fas fa-box me-2"></i>Đơn hàng đã đặt
                                                    </button>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/order-history" onClick={() => setIsDropdownOpen(false)}>
                                                    <button className="dropdown-item modal-item"
                                                            style={{color: "#8c5e58"}}>
                                                        <i className="fas fa-clock-rotate-left me-2"></i>Lịch sử đơn
                                                        hàng
                                                    </button>
                                                </NavLink>
                                            </li>
                                            <li>
                                                <NavLink to="/address" onClick={() => setIsDropdownOpen(false)}>
                                                    <button className="dropdown-item modal-item"
                                                            style={{color: "#8c5e58"}}>
                                                        <i className="fas fa-location-dot me-2"></i>Địa chỉ
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
                                                            style={{color: "#8c5e58"}}>
                                                        <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                                                    </button>
                                                </NavLink>
                                            </li>
                                        </ul>
                                    )}
                                </div>
                                )}
                                {!isLoggedIn && (
                                    <button className="btn btn-primary w-50 font-semibold" style={{marginLeft: '20px'}}>
                                        <Link to="/login">
                                            <p style={{fontSize: "14px", color: '#442e2b'}}>Đăng nhập</p>
                                        </Link>
                                    </button>
                                )}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}
function removeVietnameseTones(str) {
    str = str.replace(/[\u0300-\u036f]/g, ""); // Remove accents
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Replace Vietnamese special character
    return str;
}