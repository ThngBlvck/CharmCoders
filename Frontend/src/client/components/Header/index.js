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
            <div className="container-fluid topbar d-none d-lg-block greenPt">
                <div className="container px-0">
                    <div className="row align-items-center">
                        <div className="col-lg-12">
                            <div className="d-flex flex-wrap">
                                <a href="#" className="me-4 text-header-dGreen"><i
                                    className="fas fa-map-marker-alt ic me-2"></i>Toà nhà FPT Polytechnic,
                                    Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ</a>
                                <a href="#" className="me-4 text-header-dGreen"><i
                                    className="fas fa-phone-alt ic me-2"></i>+0941788059</a>
                                <a href="#" className="text-header-dGreen"><i
                                    className="fas fa-envelope ic me-2"></i>glowmakers6996@gmail.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-fluid sticky-top px-0">
                <div className="container-fluid px-0">
                    <nav className="navbar navbar-expand-xl bg-light">
                        <NavLink to={`/home`} className="navbar-brand">
                            <img src="/logo_web.png" className="logo-header"/>
                        </NavLink>
                        <button className="navbar-toggler py-2 px-3" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse">
                            <span className="fa fa-bars text-header-dGreen"></span>
                        </button>
                        <div className="navbar-collapse py-3" id="navbarCollapse">
                            <div className="navbar-nav mx-auto border-top">
                                <NavLink to={`/home`} className="nav-item nav-link font-semibold text-header-dGreen">Trang chủ</NavLink>
                                <NavLink to={`/products`} className="nav-item nav-link font-semibold text-header-dGreen">Sản phẩm</NavLink>
                                <NavLink to={`/post`} className="nav-item nav-link font-semibold text-header-dGreen">Bài viết</NavLink>
                                <NavLink to={`/about`} className="nav-item nav-link font-semibold text-header-dGreen">Về chúng tôi</NavLink>
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
                                        <i className="fas fa-search ic" style={{fontSize: "1.5rem"}}></i>
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

                                                    <div className="row shadow rounded">
                                                        <div className="col-3 d-flex align-items-center">
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
                                                            <p className="product-n text-dGreen" style={{
                                                                fontWeight: "bold",
                                                                overflow: "hidden", // Ẩn phần không hiển thị
                                                                textOverflow: "ellipsis", // Thêm dấu ... nếu dài hơn
                                                                whiteSpace: "normal", // Cho phép xuống dòng
                                                                maxHeight: "3em", // Giới hạn chiều cao để hiển thị 2 dòng
                                                            }}>{product.name.length > 50 ? product.name.substring(0, 50) + "..." : product.name}</p>
                                                            <small className="text-dGreen">{product.sale_price && product.sale_price < product.unit_price ? (
                                                                <div className="d-flex justify-start align-items-center">
                                                                    {/* Giá gốc bị gạch ngang */}
                                                                    <small className="text-muted text-decoration-line-through text-dGreen fs-12">
                                                                        {product.unit_price.toLocaleString("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND",
                                                                        })}
                                                                    </small>

                                                                    {/* Giá sale */}
                                                                    <small className="salePr font-semibold fs-14 ml-2">
                                                                        {product.sale_price.toLocaleString("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND",
                                                                        })}
                                                                    </small>
                                                                </div>
                                                            ) : (
                                                                // Nếu không có giá sale, hiển thị giá gốc ở giữa
                                                                <small className="text-dGreen font-semibold fs-14">
                                                                    {product.unit_price.toLocaleString("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND",
                                                                    })}
                                                                </small>
                                                            )}</small>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Icon giỏ hàng */}
                                {isLoggedIn && (
                                    <NavLink to={`/cart`} className="butn-ic ms-2"
                                             style={{
                                                 width: "50px",
                                                 height: "50px",
                                                 color: "var(--bs-primary)",
                                                 position: "relative"
                                             }}>
                                        <i className="fas fa-shopping-basket ic" style={{fontSize: "1.5rem"}}></i>
                                        <span
                                            className="font-bold bg-count"
                                            style={{
                                                position: "absolute",
                                                top: "-5px",
                                                right: "-4px",
                                                padding: "0.1rem 0.4rem",
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
                                            className="butn-ic"
                                            type="button"
                                            id="dropdownMenuButton"
                                            aria-expanded={isDropdownOpen}
                                            style={{width: "50px", height: "50px", color: "var(--bs-primary)"}}
                                        >
                                            <i className="fas fa-user ic" style={{fontSize: "1.5rem"}}></i>
                                        </button>
                                        {/* Dropdown menu */}
                                        {isDropdownOpen && (
                                            <ul className="dropdown-menu show" aria-labelledby="dropdownMenuButton"
                                                style={{left: "-68px", top: "40px"}}>
                                                <li>
                                                    <NavLink to="/profile" onClick={() => setIsDropdownOpen(false)}>
                                                        <button className="dropdown-item modal-item text-header-dGreen">
                                                            <i className="fas fa-user me-2 ic"></i>Thông tin cá nhân
                                                        </button>
                                                    </NavLink>
                                                </li>
                                                <li>
                                                    <NavLink to="/order-list" onClick={() => setIsDropdownOpen(false)}>
                                                        <button className="dropdown-item modal-item text-header-dGreen">
                                                            <i className="fas fa-box me-2 ic"></i>Đơn hàng của bạn
                                                        </button>
                                                    </NavLink>
                                                </li>
                                                <li>

                                                    <NavLink to="" onClick={() => {
                                                        // Logic cho nút thoát
                                                        toggleDropdown();
                                                    }}>
                                                        <button className="dropdown-item modal-item text-header-dGreen"
                                                                onClick={handleLogout}>
                                                            <i className="fas fa-sign-out-alt me-2 ic"></i>Đăng xuất
                                                        </button>
                                                    </NavLink>
                                                </li>
                                            </ul>
                                        )}
                                    </div>
                                )}
                                {!isLoggedIn && (
                                    <Link to="/login" className="butn rounded px-2 w-100 font-semibold shadow" style={{marginLeft: '20px'}}>
                                        <p className="fs-16">Đăng nhập</p>
                                    </Link>
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