import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {getCheckoutData, getProduct, searchProduct} from "../../../services/Product";
import {getCategory} from "../../../services/Category";
import {getBrand} from '../../../services/Brand';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addToCart} from "../../../services/Cart";
import { toast } from 'react-toastify';
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Products() {
    const {id} = useParams();
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [priceFilter, setPriceFilter] = useState("all");
    const [brandFilter, setBrandFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [productId, setProductId] = useState(null);
    const [loading, setLoading] = useState(false); // State để theo dõi trạng thái tải
    const [cart, setCart] = useState({});
    const [minPrice, setMinPrice] = useState(0); // Giá tối đa (tùy chỉnh theo giá cao nhất của sản phẩm)
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
        fetchBrands();
    }, []); // Chỉ gọi một lần khi component mount

    useEffect(() => {
        fetchProducts();
    }, [selectedCategory, brandFilter, priceFilter, searchTerm]); // Chỉ gọi lại khi thay đổi các điều kiện lọc



    const fetchProducts = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            let result;
            // Kiểm tra nếu không có bộ lọc nào được chọn, trả về tất cả sản phẩm
            if (selectedCategory === "all" && brandFilter === "all" && priceFilter === "all") {
                result = await getProduct(); // Lấy tất cả sản phẩm nếu không có bộ lọc nào
            } else {
                result = await getProduct({
                    category: selectedCategory,
                    brand: brandFilter,
                    minPrice: minPrice, // Bạn có thể thêm bộ lọc giá nếu cần
                    maxPrice: maxPrice
                });
            }

            if (Array.isArray(result)) {
                setProducts(result);
            } else if (result && result.products && Array.isArray(result.products)) {
                setProducts(result.products);
            } else {
                setProducts([]); // Không có sản phẩm nào
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
            setProducts([]); // Xử lý lỗi khi lấy dữ liệu
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    const fetchBrands = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const result = await getBrand();
            setBrands(result || []);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setBrands([]);
            toast.error("Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.");
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    const fetchCategories = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const result = await getCategory();
            setCategories(result);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };




    const maxPrice = Math.max(...products.map(product => {
        const productPrice = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.unit_price);
        return productPrice;
    }));

    const filteredProducts = products.filter(product => {
        // Lọc theo danh mục
        const matchCategory = selectedCategory === "all" || product.category_id === parseInt(selectedCategory);

        // Lọc theo thương hiệu
        const matchBrand = brandFilter === "all" || product.brand_id === parseInt(brandFilter);

        // Lọc theo giá
        const productPrice = product.sale_price ? parseFloat(product.sale_price) : parseFloat(product.unit_price);
        const matchPrice = productPrice >= minPrice && productPrice <= maxPrice;

        // Chỉ trả về sản phẩm phù hợp cả 3 điều kiện
        return matchCategory && matchBrand && matchPrice;
    });

    const productsPerPage = 12;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleFilterChange = (setter) => (e) => {
        setter(e.target.value);
        setCurrentPage(1);
    };

    const handleBuyNow = async (productId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để mua sản phẩm.',
                confirmButtonText: 'Đăng nhập',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Chuyển hướng đến trang đăng nhập
                }
            });
            return;
        }

        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`);
        try {
            const response = await addToCart(productId, quantity);
            toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
            navigate(`/cart?productId=${productId}`);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error); // Lưu ý không ghi log đối tượng toàn bộ
            toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
        }
    };

    return (
        <>
            {/* Bộ lọc sản phẩm */}
            <div className="container py-4">
                <div className="row">
                    {/* Danh mục */}
                    <div className="col-md-4 mb-3">
                        <p className="font-bold text-dGreen fs-20">
                            Danh mục sản phẩm
                        </p>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={handleFilterChange(setSelectedCategory)}
                        >
                            <option value="all" className="text-dGreen">
                                Tất cả
                            </option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id} className="text-dGreen">
                                        {category.name.length > 30 ? category.name.substring(0, 30) + "..." : category.name}
                                    </option>
                                ))
                            ) : (
                                <option value="none" className="text-dGreen">
                                    Không có danh mục nào
                                </option>
                            )}
                        </select>
                    </div>

                    {/* Lọc theo thương hiệu */}
                    <div className="col-md-4 mb-3">
                        <p className="font-bold text-dGreen fs-20">
                            Lọc theo thương hiệu
                        </p>
                        <select
                            className="form-select"
                            value={brandFilter}
                            onChange={handleFilterChange(setBrandFilter)}
                        >
                            <option value="all" className="text-dGreen">
                                Tất cả
                            </option>
                            {brands.length > 0 ? (
                                brands.map((brand) => (
                                    <option key={brand.id} value={brand.id} className="text-dGreen">
                                        {brand.name}
                                    </option>
                                ))
                            ) : (
                                <option value="none" className="text-dGreen">
                                    Không có nhãn hàng nào
                                </option>
                            )}
                        </select>
                    </div>

                    {/* Lọc theo giá */}
                    <div className="col-md-4 mb-3">
                        <p className="font-bold text-dGreen fs-20">
                            Chọn mức giá
                        </p>
                        <div className="d-flex align-items-center">
                            {/* Giá thấp nhất */}
                            <span className="text-dGreen" style={{marginRight: "10px"}}>0 ₫</span>
                            <input
                                type="range"
                                min="0"
                                max={maxPrice}
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="form-range"
                                style={{flex: 1}}
                            />
                            {/* Giá cao nhất */}
                            <span className="text-dGreen" style={{marginLeft: "10px"}}>
                                {maxPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                            </span>
                        </div>
                        <p>Giá: {minPrice.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</p>
                    </div>
                </div>
            </div>

            {/* Hiển thị sản phẩm */}
            <div className="container">
                {loading ? (
                    <div className="row">
                        {Array.from({length: 12}).map((_, index) => (
                            <div key={index} className="col-md-6 col-lg-3 mb-3">
                                <div className="card text-center p-2 shadow rounded">
                                    <Skeleton height={150} className="img-fluid rounded img-pro"/>
                                    <div className="card-body">
                                        <Skeleton height={20} width="80%" style={{marginBottom: "10px"}}/>
                                        <Skeleton height={20} width="60%"/>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {currentProducts && currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                                        <div className="card text-center bg-hover shadow p-2 rounded">
                                            <NavLink to={`/products/${product.id}`}>
                                                <img
                                                    src={product.image}
                                                    className="card-img-top img-fluid rounded img-pro"
                                                    alt="Product"
                                                />
                                            </NavLink>
                                            <div className="card-body">
                                                <NavLink to={`/products/${product.id}`}
                                                         className="text-decoration-none">
                                                    <p className="card-title font-semibold text-dGreen">
                                                        {product.name.length > 30 ? product.name.substring(0, 20) + "..." : product.name}
                                                    </p>
                                                </NavLink>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    {/* Kiểm tra có giá sale hay không */}
                                                    {product.sale_price && product.sale_price < product.unit_price ? (
                                                        <>
                                                            {/* Giá sản phẩm gốc bị gạch ngang */}
                                                            <p className="card-text mb-2 font-semibold text-dGreen text-decoration-line-through flex-1 fs-14">
                                                                {product.unit_price.toLocaleString("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND"
                                                                })}
                                                            </p>

                                                            {/* Giá sale nằm bên phải */}
                                                            <p className="card-text mb-2 font-semibold salePr flex-1 fs-16">
                                                                {product.sale_price.toLocaleString("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND"
                                                                })}
                                                            </p>
                                                        </>
                                                    ) : (
                                                        // Nếu không có giá sale, đơn giản là hiển thị giá gốc ở giữa
                                                        <p className="card-text mb-2 font-semibold text-dGreen flex-1 text-center fs-16">
                                                            {product.unit_price.toLocaleString("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND"
                                                            })}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Nút Mua ngay */}
                                                {product.quantity === 0 ? (
                                                    <p className="text-dGreen font-bold fs-16 mt-1">Hết hàng</p>
                                                ) : (
                                                    <button
                                                        className="butn mr-2 font-semibold w-100 fs-14 rounded"
                                                        style={{
                                                            padding: '16px',
                                                            width: '140px',
                                                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                            backgroundColor: product.quantity === 0 ? "#dcdcdc" : "#228B22", // Disabled button color when out of stock
                                                            color: product.quantity === 0 ? "black" : "white",
                                                            cursor: product.quantity === 0 ? "not-allowed" : "pointer",
                                                        }}
                                                        onClick={() => handleBuyNow(product.id, cart[product.id] || 1)}
                                                        disabled={product.quantity === 0}  // Disable the button if out of stock
                                                    >
                                                        <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                                              style={{marginRight: "6px"}}></i>Mua ngay</p>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center" style={{fontSize: '30px', color: '#8c5e58'}}>Không có sản
                                    phẩm!</p>
                            )}
                        </div>

                        {/* Phân trang */}
                        <div className="d-flex justify-content-center mt-4">
                            {Array.from({length: totalPages}, (_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setCurrentPage(index + 1)}
                                    className={`butn-page mx-1 ${index + 1 === currentPage ? "butn" : "butn-border"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </>
                )}
            </div>

        </>
    );
}

function removeVietnameseTones(str) {
    str = str.replace(/[\u0300-\u036f]/g, ""); // Remove accents
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Replace Vietnamese special character
    return str;
}