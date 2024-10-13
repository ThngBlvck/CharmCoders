import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {NavLink, useNavigate, useParams} from "react-router-dom";
import Slider from "react-slick";
import { getProduct, searchProduct, getOneProduct } from "../../../services/Product";
import { getBrand } from '../../../services/Brand';
import Swal from "sweetalert2";
import {jwtDecode} from "jwt-decode";

export default function Home() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); // Lấy token từ localStorage

    useEffect(() => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded && decoded.userId) {
                    setUserId(decoded.userId);
                    console.log("userId:", decoded.userId);
                } else {
                    console.error("Token không hợp lệ.");
                }
            } catch (error) {
                console.error("Lỗi khi giải mã token:", error);
            }
        }

        fetchProducts();
        fetchBrands();
    }, [searchTerm, id, userId]);

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
                // Chỉ lấy tối đa 8 sản phẩm
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

    const handleBuyNow = (selectedProduct) => {
        if (!token) {
            alert('Bạn cần đăng nhập để mua ngay sản phẩm!');
            return; // Dừng lại nếu không có token
        }

        if (selectedProduct && selectedProduct.id) {
            // Chuyển đến trang thanh toán chỉ với productId
            navigate(`/checkout?product_id=${selectedProduct.id}`);
        } else {
            console.error("Sản phẩm không tồn tại hoặc không có product_id.");
        }

        console.log("selectedProduct:", selectedProduct);
    };

    return (
        <>
            <div className="container-fluid services py-1 d-flex">
                <div className="container py-5">
                    <div className="mx-auto text-center mb-5" style={{maxWidth: "800px"}}>
                        <p className="fs-4 text-center text-primary font-bold custom-font">GlowMakers</p>
                        <p className="font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>Các sản phẩm mới nhất</p>
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
                                                       style={{color: '#8c5e58'}}>{product.name}</p>
                                                </NavLink>
                                                <p className="card-text mb-4 font-semibold"
                                                   style={{color: '#8c5e58'}}>{product.unit_price ? product.unit_price.toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                }) : "Không có giá"}</p>
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
                                <p className="text-center">Đang tải dữ liệu...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-5" style={{backgroundColor: '#f9f9f9'}}>
                <div className="container text-center">
                    <p className="font-bold mb-5" style={{color: '#8c5e58', fontSize: "30px"}}>Các thương hiệu</p>
                    <Slider className="mb-5 position-relative" {...sliderSettings}>
                        {brands.length > 0 ? (
                            brands.map((brand) => (
                                <div key={brand.id}
                                     className="text-center d-flex flex-column align-items-center card-style">
                                    <div className="brand-card w-100" style={{
                                        padding: '15px',
                                        backgroundColor: '#fff',
                                        borderRadius: '15px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        maxWidth: '200px',
                                        transition: 'transform 0.3s ease',
                                    }}>
                                        <img src={brand.image || "https://via.placeholder.com/200"} alt={brand.name}
                                             className="img-fluid rounded"
                                             style={{width: '100%', height: 'auto', marginBottom: '10px'}}/>
                                    </div>
                                    <p className="mt-2" style={{
                                        color: '#8c5e58',
                                        fontWeight: 'bold',
                                        fontSize: '16px',
                                        textTransform: 'uppercase',
                                    }}>{brand.name}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Đang tải dữ liệu...</p>
                        )}
                    </Slider>
                    <NavLink to="/brands" className="btn btn-secondary rounded-pill py-3 px-5 mt-1">
                        Xem Tất Cả
                    </NavLink>
                </div>
            </div>
            <div className="container-fluid about py-2">
                <div className="container py-5">
                    <div className="row g-5 align-items-center">
                        {/* Hình ảnh bên trái */}
                        <div className="col-lg-5">
                            <div className="video">
                                <img src="https://via.placeholder.com/400x300" className="img-fluid rounded"
                                     alt="About Us"/>
                                <div className="position-absolute rounded border-5 border-top border-start border-white"
                                     style={{bottom: '0', right: '0'}}>
                                    <img src="https://via.placeholder.com/200x150" className="img-fluid rounded"
                                         alt="Extra Image"/>
                                </div>
                            </div>
                        </div>

                        {/* Nội dung giới thiệu */}
                        <div className="col-lg-7">
                            <div>
                                <p className="fs-4 text-primary font-semibold custom-font">Về Chúng Tôi</p>
                                <p className="mb-4 font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>GlowMakers –
                                    Cửa hàng mỹ phẩm dưỡng da, dưỡng môi chính hãng.</p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và dưỡng môi
                                    cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp bạn tự
                                    tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành tính, chiết
                                    xuất từ thiên nhiên, phù hợp cho mọi loại da...
                                </p>
                                <NavLink to={`/about`} className="btn btn-secondary rounded-pill py-3 px-5">
                                    Xem thêm
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 ô cam kết */}
            <div className="container py-5 d-flex justify-content-center" style={{fontFamily: 'Roboto, sans-serif'}}>
                <div className="row text-center">
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                             style={{backgroundColor: '#fff7f8'}}>
                            <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng"
                                 className="img-fluid mb-3 rounded" style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Thanh toán khi nhận hàng</p>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                             style={{backgroundColor: '#fff7f8'}}>
                            <img src="https://via.placeholder.com/150x150" alt="Thương hiệu uy tín toàn cầu"
                                 className="img-fluid mb-3 rounded" style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Thương hiệu uy tín toàn cầu</p>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                             style={{backgroundColor: '#fff7f8'}}>
                            <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí"
                                 className="img-fluid mb-3 rounded" style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">30 ngày đổi trả miễn phí</p>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                             style={{backgroundColor: '#fff7f8'}}>
                            <img src="https://via.placeholder.com/150x150" alt="Sản phẩm chính hãng 100%"
                                 className="img-fluid mb-3 rounded" style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Sản phẩm chính hãng 100%</p>
                        </div>
                    </div>
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
