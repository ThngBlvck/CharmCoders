import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {getCheckoutData, getProduct, searchProduct} from "../../../services/Product";
import {getCategory} from "../../../services/Category";
import {getBrand} from '../../../services/Brand';
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addToCart} from "../../../services/Cart";


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
        // Nếu id có giá trị và khác 'all', cập nhật selectedCategory
        if (id && id !== "all") {
            setSelectedCategory(id);
        }
        fetchProducts();
        fetchCategories();
        fetchBrands();
    }, [productId, searchTerm, selectedCategory, priceFilter, brandFilter, id]); // Không cần giải mã token, chỉ cần kiểm tra xem token có trong localStorage hay không


    const fetchProducts = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            let result;
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
            Swal.fire('Lỗi', 'Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.', 'error');
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

    const productsPerPage = 12;

    const filteredProducts = products
        .filter(product => selectedCategory === "all" || product.category_id === parseInt(selectedCategory)) // Lọc theo category_id
        .filter(product => {
            const productPrice = parseFloat(product.unit_price);
            return productPrice >= minPrice; // Lọc sản phẩm có giá <= maxPrice
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

    const handleBuyNow = async (productId, quantity) => {
        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`);
        try {
            const response = await addToCart(productId, quantity);
            Swal.fire('Thành công', 'Thêm vào giỏ hàng thành công.', 'success');
            navigate(`/cart?productId=${productId}`);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error); // Lưu ý không ghi log đối tượng toàn bộ
        }
    };

    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid py-3" style={{backgroundColor: "#fff7f8"}}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{color: "#ffa69e", fontSize: "40px"}}>
                        Sản phẩm
                    </p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{color: "#ffa69e"}}>
                            <NavLink to={`/home`}>Trang chủ</NavLink>
                        </li>
                        <li className="breadcrumb-item active font-bold" style={{color: "#ffa69e"}}>
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
                        <p style={{fontSize: "20px", color: "#8c5e58"}} className="font-bold">
                            Danh mục sản phẩm
                        </p>
                        <select
                            className="form-select"
                            value={selectedCategory}
                            onChange={handleFilterChange(setSelectedCategory)}
                        >
                            <option value="all" style={{color: "#8c5e58"}}>
                                Tất cả
                            </option>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <option key={category.id} value={category.id} style={{color: "#8c5e58"}}>
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
                        <p style={{fontSize: "20px", color: "#8c5e58"}} className="font-bold">
                            Chọn mức giá
                        </p>
                        <div className="d-flex align-items-center">
                            {/* Giá thấp nhất */}
                            <span style={{color: "#8c5e58", marginRight: "10px"}}>0</span>
                            <input
                                type="range"
                                min="0"
                                max="1000000"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="form-range"
                                style={{flex: 1}}
                            />
                            {/* Giá cao nhất */}
                            <span style={{color: "#8c5e58", marginLeft: "10px"}}>1,000,000</span>
                        </div>
                        <p>Giá: {minPrice.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}</p>
                    </div>

                    {/* Lọc theo thương hiệu */}
                    <div className="col-md-4 mb-3">
                        <p style={{fontSize: "20px", color: "#8c5e58"}} className="font-bold">
                            Lọc theo thương hiệu
                        </p>
                        <select
                            className="form-select"
                            value={brandFilter}
                            onChange={handleFilterChange(setBrandFilter)}
                        >
                            <option value="all" style={{color: "#8c5e58"}}>
                                Tất cả
                            </option>
                            {brands.length > 0 ? (
                                brands.map((brand) => (
                                    <option key={brand.id} value={brand.id} style={{color: "#8c5e58"}}>
                                        {brand.name}
                                    </option>
                                ))
                            ) : (
                                <option value="none" style={{color: "#8c5e58"}}>
                                    Không có nhãn hàng nào
                                </option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            {/* Hiển thị sản phẩm */}
            <div className="container">
                {loading ? (
                    <div className="d-flex flex-column align-items-center"
                         style={{marginTop: '10rem', marginBottom: '10rem'}}>
                        <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                        <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                    </div>
                ) : (
                    <>
                        <div className="row">
                            {currentProducts && currentProducts.length > 0 ? (
                                currentProducts.map((product) => (
                                    <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                                        <div className="card text-center bg-hover"
                                             style={{borderRadius: "15px", padding: "20px"}}>
                                            <NavLink to={`/products/${product.id}`}>
                                            <img
                                                    src={product.image}
                                                    className="card-img-top img-fluid rounded"
                                                    alt="Product"
                                                    style={{maxHeight: "200px", objectFit: "cover"}}
                                                />
                                            </NavLink>
                                            <div className="card-body">
                                                <NavLink to={`/products/${product.id}`}
                                                         className="text-decoration-none">
                                                    <p className="card-title font-semibold" style={{color: '#8c5e58'}}>
                                                        {product.name.length > 30 ? product.name.substring(0, 20) + "..." : product.name}
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
                                                    onClick={() => handleBuyNow(product.id, cart[product.id] || 1)}
                                                >
                                                    <p>Mua ngay</p>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center" style={{fontSize: '30px', color: '#8c5e58'}}>Không có sản phẩm!</p>
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
