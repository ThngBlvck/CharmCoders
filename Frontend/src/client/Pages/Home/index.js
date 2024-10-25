import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import Slider from "react-slick";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {getProduct, searchProduct, getCheckoutData} from "../../../services/Product";
import { getBrand } from '../../../services/Brand';
import Swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addToCart} from "../../../services/Cart";

export default function Home() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false); // Thêm state loading
    const [cart, setCart] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
        fetchBrands();
    }, [searchTerm, id]);

    const fetchProducts = async () => {
        setLoading(true); // Bật trạng thái loading
        try {
            let result;
            if (searchTerm.trim() === "") {
                result = await getProduct();
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm);
                result = await searchProduct(sanitizedSearchTerm);
            }

            if (Array.isArray(result)) {
                setProducts(result.slice(0, 8));
            } else if (result && result.products && Array.isArray(result.products)) {
                setProducts(result.products.slice(0, 8));
            } else {
                setProducts([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
            setProducts([]);
        }
        setLoading(false); // Tắt trạng thái loading
    };

    const fetchBrands = async () => {
        setLoading(true); // Bật trạng thái loading
        try {
            const result = await getBrand();
            setBrands(result || []);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setBrands([]);
            Swal.fire('Lỗi', 'Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.', 'error');
        }
        setLoading(false); // Tắt trạng thái loading
    };

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
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
            {loading ? (
                <div className="d-flex flex-column align-items-center"
                     style={{marginTop: '10rem', marginBottom: '10rem'}}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                    <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                </div>
            ) : (
                <>
                    <div className="container-fluid services py-1 d-flex">
                        <div className="container py-5">
                            <div className="mx-auto text-center mb-5" style={{maxWidth: "800px"}}>
                                <p className="fs-4 text-center text-primary font-bold custom-font">GlowMakers</p>
                                <p className="font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>Các sản phẩm mới
                                    nhất</p>
                            </div>
                            <div className="row g-4">
                                <div className="row">
                                    {products && products.length > 0 ? (
                                        products.map((product, index) => (
                                            <div key={product.id} className="col-md-6 col-lg-3 mb-3">
                                                <div className="card text-center bg-hover"
                                                     style={{borderRadius: '15px', padding: '20px'}}>
                                                    <NavLink to={`/products/${product.id}`}>
                                                        <img
                                                            src={product.image || "https://via.placeholder.com/500"}
                                                            className="card-img-top img-fluid rounded"
                                                            alt="Product"
                                                            style={{maxHeight: '500px', objectFit: 'cover'}}
                                                        />
                                                    </NavLink>
                                                    <div className="card-body">
                                                        <NavLink to={`/products/${product.id}`}>
                                                            <p className="card-title font-semibold"
                                                               style={{color: '#8c5e58'}}>{product.name.length > 30 ? product.name.substring(0, 20) + "..." : product.name}</p>
                                                        </NavLink>
                                                        <p className="card-text mb-4 font-semibold"
                                                           style={{color: '#8c5e58'}}>{product.unit_price ? product.unit_price.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        }) : "Không có giá"}</p>
                                                        <button
                                                            className="btn btn-primary mr-2 font-bold w-100"
                                                            style={{
                                                                padding: '14px',
                                                                fontSize: '13px',
                                                                color: '#442e2b'
                                                            }}
                                                            onClick={() => handleBuyNow(product.id, cart[product.id] || 1)}
                                                        >
                                                            <p>Mua ngay</p>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center">Không có sản phẩm để hiển thị</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid py-5" style={{backgroundColor: "#f9f9f9"}}>
                        <div className="container text-center">
                            <p className="font-bold mb-5" style={{color: "#8c5e58", fontSize: "30px"}}>Các thương
                                hiệu</p>
                                <Slider className="mb-5 position-relative" {...sliderSettings}>
                                    {brands.length > 0 ? (
                                        brands.map((brand) => (
                                            <div key={brand.id}
                                                 className="text-center d-flex flex-column align-items-center card-style">
                                                <div className="brand-card w-100" style={{
                                                    padding: "15px",
                                                    backgroundColor: "#fff",
                                                    borderRadius: "15px",
                                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                    maxWidth: "200px",
                                                    height: '200px',
                                                    display: 'flex',            // Sử dụng Flexbox
                                                    flexDirection: 'column',    // Sắp xếp theo chiều dọc
                                                    alignItems: 'center',       // Căn giữa theo chiều ngang
                                                    justifyContent: 'center',   // Căn giữa theo chiều dọc
                                                    transition: "transform 0.3s ease",
                                                }}>
                                                    <img src={brand.image || "https://via.placeholder.com/200"}
                                                         alt={brand.name} className="img-fluid rounded"
                                                         style={{width: "100%", height: "auto", marginBottom: "10px"}}/>
                                                </div>
                                                <p className="mt-2" style={{
                                                    color: "#8c5e58",
                                                    fontWeight: "bold",
                                                    fontSize: "16px",
                                                    textTransform: "uppercase"
                                                }}>
                                                    {brand.name}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center">Không có thương hiệu nào.</p>
                                    )}
                                </Slider>
                            <NavLink to="/brands" className="btn btn-secondary rounded-pill py-3 px-5 mt-1">
                                Xem Tất Cả
                            </NavLink>
                        </div>
                    </div>
                </>
            )}
        </>
    );
}

function removeVietnameseTones(str) {
    str = str.replace(/[\u0300-\u036f]/g, ""); // Remove accents
    str = str.replace(/đ/g, "d").replace(/Đ/g, "D"); // Replace Vietnamese special character
    return str;
}
