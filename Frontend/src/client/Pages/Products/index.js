import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import { getProduct, searchProduct } from "../../../services/Product";
import { getCategory } from "../../../services/Category";
import { getBrand } from '../../../services/Brand';
import Swal from "sweetalert2";
import {jwtDecode} from "jwt-decode";

export default function Products() {
    const { id } = useParams();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [brandFilter, setBrandFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.userId);
        }

        // Nếu id có giá trị và khác 'all', cập nhật selectedCategory
        if (id && id !== "all") {
            setSelectedCategory(id);
        }

        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, [searchTerm, selectedCategory, priceFilter, brandFilter, id]); // Thêm id vào dependencies

    const fetchProducts = async () => {
        try {
            let result;
            // Chỉ lấy sản phẩm theo category_id khi selectedCategory không phải "all"
            if (searchTerm.trim() === "" && selectedCategory === "all" && priceFilter === "all" && brandFilter === "all") {
                result = await getProduct();
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm);
                result = await searchProduct(sanitizedSearchTerm, selectedCategory);
            }

            if (Array.isArray(result)) {
                setProducts(result);
            } else if (result && result.products && Array.isArray(result.products)) {
                setProducts(result.products);
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
            setProducts([]);
        }
    };

    const fetchBrands = async () => {
        try {
            const result = await getBrand();
            setBrands(result || []);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setBrands([]);
            Swal.fire('Lỗi', 'Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.', 'error');
        }
    };

    const fetchCategories = async () => {
        try {
            const result = await getCategory();
            setCategories(result);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        }
    };

    const productsPerPage = 12;

    const filteredProducts = products
        .filter(product => selectedCategory === "all" || product.category_id === parseInt(selectedCategory)) // Lọc theo category_id
        .filter(product => {
            const productPrice = parseFloat(product.unit_price); // Chuyển giá sản phẩm sang dạng số
            if (priceFilter === "low") return productPrice < 100000;
            if (priceFilter === "high") return productPrice >= 100000;
            return true;
        })
        .filter(product => brandFilter === "all" || product.brand_id === parseInt(brandFilter))

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    const handleBuyNow = (selectedProduct) => {
        if (!token) {
            alert('Bạn cần đăng nhập để mua ngay sản phẩm!');
            return; // Dừng lại nếu không có token
        }

        if (selectedProduct && selectedProduct.id) {
            // Chuyển đến trang thanh toán chỉ với productId
            navigate(`/checkout?productId=${selectedProduct.id}`);
        } else {
            console.error("Sản phẩm không tồn tại hoặc không có productId.");
        }
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid py-3" style={{ backgroundColor: "#fff7f8" }}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{ color: "#ffa69e", fontSize: "40px" }}>
                        Sản phẩm
                    </p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{ color: "#ffa69e" }}>
                            <NavLink to={`/home`}>Trang chủ</NavLink>
                        </li>
                        <li className="breadcrumb-item active font-bold" style={{ color: "#ffa69e" }}>
                            Sản phẩm
                        </li>
                    </ol>
                </div>
            </div>

            {/* Bộ lọc sản phẩm */}
            <div className="container py-4">
                <div className="row">
                    {/* Danh mục */}
                    <div className="col-md-4 mb-3">
                        <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold">
                            Danh mục sản phẩm
                        </p>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={handleFilterChange(setSelectedCategory)}
                        >
                            <option value="all" style={{ color: "#8c5e58" }}>
                                Tất cả
                            </option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id} style={{ color: "#8c5e58" }}>
                                        {category.name.length > 30 ? category.name.substring(0, 30) + "..." : category.name}
                                    </option>
                                ))
                            ) : (
                                <option value="none" style={{color: "#8c5e58"}}>
                                    Không có danh mục nào
                                </option>
                            )}
                        </select>
                    </div>

                    {/* Lọc theo giá */}
                    <div className="col-md-4 mb-3">
                        <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold">
                            Lọc theo giá
                        </p>
                        <select
                            className="form-select"
                            value={priceFilter}
                            onChange={handleFilterChange(setPriceFilter)}
                        >
                            <option value="all" style={{ color: "#8c5e58" }}>
                                Tất cả
                            </option>
                            <option value="low" style={{ color: "#8c5e58" }}>
                                Dưới 100.000đ
                            </option>
                            <option value="high" style={{ color: "#8c5e58" }}>
                                Từ 100.000đ trở lên
                            </option>
                        </select>
                    </div>

                    {/* Lọc theo thương hiệu */}
                    <div className="col-md-4 mb-3">
                        <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold">
                            Lọc theo thương hiệu
                        </p>
                        <select
                            className="form-select"
                            value={brandFilter}
                            onChange={handleFilterChange(setBrandFilter)}
                        >
                            <option value="all" style={{ color: "#8c5e58" }}>
                                Tất cả
                            </option>
                            {brands.length > 0 ? (
                                brands.map((brand) => (
                                    <option key={brand.id} value={brand.id} style={{ color: "#8c5e58" }}>
                                        {brand.name}
                                    </option>
                                ))
                            ) : (
                                <option value="none" style={{ color: "#8c5e58" }}>
                                    Không có nhãn hàng nào
                                </option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Hiển thị sản phẩm */}
            <div className="container">
                <div className="row">
                    {currentProducts && currentProducts.length > 0 ? (
                        currentProducts.map((product) => (
                            <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                                <div className="card text-center bg-hover" style={{ borderRadius: "15px", padding: "20px" }}>
                                    <NavLink to={`/products/${product.id}`}>
                                        <img
                                            src={product.image}
                                            className="card-img-top img-fluid rounded"
                                            alt="Product"
                                            style={{ maxHeight: "500px", objectFit: "cover" }}
                                        />
                                    </NavLink>
                                    <div className="card-body">
                                        <NavLink to={`/products/${product.id}`} className="text-decoration-none">
                                            <p className="card-title font-semibold" style={{color: '#8c5e58'}}>
                                                {product.name}
                                            </p>
                                        </NavLink>
                                        <p className="card-text mb-4 font-semibold" style={{color: '#8c5e58'}}>
                                            {product.unit_price ? product.unit_price.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            }) : "Không có giá"}
                                        </p>

                                        <button
                                            className="btn btn-primary mr-2 font-bold w-100"
                                            style={{padding: '14px', fontSize: '13px', color: '#442e2b'}}
                                            onClick={() => handleBuyNow(product)}
                                        >
                                            <p>Mua ngay</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Đang tải dữ liệu...</p>
                    )}
                </div>

                {/* Phân trang */}
                <div className="d-flex justify-content-center mt-4">
                    {Array.from({length: totalPages}, (_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentPage(index + 1)}
                            className={`btn mx-1 ${index + 1 === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                        >
                            {index + 1}
                        </button>
                    ))}
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
