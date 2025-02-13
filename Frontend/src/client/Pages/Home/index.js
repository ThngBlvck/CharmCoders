import React, { useEffect, useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getProduct, searchProduct, getCheckoutData, getHotProducts } from "../../../services/Product";
import { getBrand } from '../../../services/Brand';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addToCart } from "../../../services/Cart";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getBanner } from "../../../services/Banner";


export default function Home() {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [banners, setBanners] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false); // Thêm state loading
    const [cart, setCart] = useState({});
    const navigate = useNavigate();
    const [hotProducts, setHotProducts] = useState([]); // Hot products data
    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchBanners();
        fetchHotProducts();
    }, [searchTerm, id]);

    // Giả sử bạn đã có mã để lấy sản phẩm bán chạy, bạn có thể làm như sau:
    const fetchHotProducts = async () => {
        try {
            // Fetch hot products
            const hotProductsResult = await getHotProducts();
            console.log(hotProductsResult); // Log kết quả để kiểm tra

            if (hotProductsResult && hotProductsResult.hot_products) {
                setHotProducts(hotProductsResult.hot_products);
            } else {
                toast.warning('Không tìm thấy sản phẩm hot.');
            }
        } catch (error) {
            console.error("Lỗi khi fetch sản phẩm:", error);
            toast.error('Có lỗi xảy ra khi lấy sản phẩm.');
        }
    };

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
            toast.error("Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.");
        }
        setLoading(false); // Tắt trạng thái loading
    };


    const fetchBanners = async () => {
        try {
            const bannersData = await getBanner();
            console.log("Banners fetched:", bannersData);
            setBanners(bannersData);
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        }
    };


    const sliderSettings = {
        dots: false,
        infinite: brands.length >= 5, // Chỉ cho phép infinite nếu có 5 item trở lên
        speed: 500,
        slidesToShow: Math.min(brands.length, 5), // Luôn luôn hiển thị 5 item
        slidesToScroll: 1,
        arrows: false,
        autoplay: brands.length >= 5, // Chỉ tự động chạy khi có 5 item trở lên
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2, // Tối đa hiển thị 2 item cho kích thước màn hình nhỏ hơn 768px
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1, // Luôn hiển thị 1 item cho kích thước màn hình nhỏ hơn 480px
                },
            },
        ],
    };

    const settings = {
        infinite: true, // Chạy vòng lặp
        speed: 500, // Thời gian chuyển hình
        slidesToShow: 1, // Số lượng hình ảnh hiển thị mỗi lần
        slidesToScroll: 1, // Số lượng hình ảnh chuyển khi ấn
        autoplay: true, // Tự động chạy
        autoplaySpeed: 3000, // Tốc độ tự động chuyển hình
        arrows: true, // Hiển thị nút điều hướng
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
            {loading ? (
                <div className="row">
                    {Array.from({ length: 8 }).map((_, index) => (
                        <div key={index} className="col-md-6 col-lg-3 mb-3">
                            <div className="card text-center p-2 shadow rounded">
                                <Skeleton height={150} className="img-fluid rounded img-pro" />
                                <div className="card-body">
                                    <Skeleton height={20} width="80%" style={{ marginBottom: "10px" }} />
                                    <Skeleton height={20} width="60%" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="container-fluid about py-2 shadow mb-3 mt-3 rounded">
                        <Skeleton height={300} width="100%" />
                    </div>
                    <div className="container-fluid about py-2 shadow mb-3 mt-3 rounded">
                        <Skeleton height={300} width="100%" />
                    </div>
                </div>
            ) : (
                <>
                    <div className="container-fluid px-0">
                        <Slider {...settings}>
                            {banners.map((banner, index) => (
                                <div key={index}>
                                    <img
                                        src={banner.image_url}
                                        className="d-block w-100 mw-slider"
                                        alt={banner.image_url}
                                    />
                                </div>
                            ))}
                        </Slider>
                    </div>

                    <div className="container-fluid py-1 d-flex">
                        <div className="container py-5">
                            <div className="mx-auto text-center mb-5" style={{ maxWidth: "800px" }}>
                                <p className="fs-4 text-center text-dGreen font-bold">GlowMakers</p>
                                <p className="font-bold text-dGreen fs-30">Sản phẩm mới</p>
                            </div>
                            <div className="row g-4">
                                <div className="row">
                                    {products && products.length > 0 ? (
                                        products.map((product, index) => (
                                            <div key={product.id} className="col-md-6 col-lg-3 mb-3">
                                                <div className="card text-center bg-hover shadow rounded p-2">
                                                    <NavLink to={`/products/${product.id}`}>
                                                        <img
                                                            src={product.image || "https://via.placeholder.com/500"}
                                                            className="card-img-top img-fluid rounded img-pro"
                                                            alt="Product"
                                                        />
                                                    </NavLink>
                                                    <div className="card-body">
                                                        <NavLink to={`/products/${product.id}`}>
                                                            <p className="card-title font-semibold text-dGreen">
                                                                {product.name.length > 30 ? product.name.substring(0, 20) + "..." : product.name}
                                                            </p>
                                                        </NavLink>

                                                        <div
                                                            className="d-flex justify-content-between align-items-center">
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
                                                                    <p className="card-text mb-2 font-semibold salePr fs-16 flex-1">
                                                                        {product.sale_price.toLocaleString("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND"
                                                                        })}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                // Nếu không có giá sale, đơn giản là hiển thị giá gốc ở giữa
                                                                <p className="card-text mb-2 font-semibold text-dGreen text-center flex-1 fs-16">
                                                                    {product.unit_price.toLocaleString("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND"
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {product.quantity === 0 ? (
                                                            <p className="text-danger font-bold fs-16"
                                                                style={{ marginTop: '10px' }}>Hết
                                                                hàng</p>
                                                        ) : (
                                                            <button
                                                                className="butn mr-2 font-semibold w-100 fs-14 rounded"
                                                                style={{
                                                                    padding: '16px',
                                                                    width: '140px',
                                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                                    backgroundColor: product.quantity === 0 ? "#dcdcdc" : "#228B22", // Disabled button color when out of stock
                                                                    color: product.quantity === 0 ? "black" : "white",
                                                                    cursor: product.quantity === 0 ? "not-allowed" : "pointer"
                                                                }}
                                                                onClick={() => handleBuyNow(product.id, cart[product.id] || 1)}
                                                                disabled={product.quantity === 0}  // Disable the button if out of stock
                                                            >
                                                                <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                                                    style={{ marginRight: "6px" }}></i>Mua ngay</p>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center fs-30 text-dGreen">Không có sản phẩm để hiển thị</p>
                                    )}
                                </div>
                            </div>
                            <div className="mx-auto text-center mb-5" style={{ maxWidth: "800px" }}>
                                <p className="font-bold text-dGreen fs-30">Sản phẩm bán chạy</p>
                            </div>
                            <div className="row g-4">
                                <div className="row">
                                    {hotProducts && hotProducts.length > 0 ? (
                                        hotProducts.map((hotProducts, index) => (
                                            <div key={hotProducts.id} className="col-md-6 col-lg-3 mb-3">
                                                <div className="card text-center bg-hover shadow rounded p-2">
                                                    <NavLink to={`/products/${hotProducts.id}`}>
                                                        <img
                                                            src={hotProducts.image || "https://via.placeholder.com/500"}
                                                            className="card-img-top img-fluid rounded img-pro"
                                                            alt="Product"
                                                        />
                                                    </NavLink>
                                                    <div className="card-body">
                                                        <NavLink to={`/products/${hotProducts.id}`}>
                                                            <p className="card-title font-semibold text-dGreen">
                                                                {hotProducts.name.length > 30 ? hotProducts.name.substring(0, 20) + "..." : hotProducts.name}
                                                            </p>
                                                        </NavLink>

                                                        <div
                                                            className="d-flex justify-content-between align-items-center">
                                                            {hotProducts.sale_price && hotProducts.sale_price < hotProducts.unit_price ? (
                                                                <>
                                                                    <p className="card-text mb-2 font-semibold text-dGreen text-decoration-line-through flex-1 fs-14">
                                                                        {hotProducts.unit_price.toLocaleString("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND"
                                                                        })}
                                                                    </p>
                                                                    <p className="card-text mb-2 font-semibold salePr fs-16 flex-1">
                                                                        {hotProducts.sale_price.toLocaleString("vi-VN", {
                                                                            style: "currency",
                                                                            currency: "VND"
                                                                        })}
                                                                    </p>
                                                                </>
                                                            ) : (
                                                                <p className="card-text mb-2 font-semibold text-dGreen text-center flex-1 fs-16">
                                                                    {hotProducts.unit_price.toLocaleString("vi-VN", {
                                                                        style: "currency",
                                                                        currency: "VND"
                                                                    })}
                                                                </p>
                                                            )}
                                                        </div>

                                                        {hotProducts.quantity === 0 ? (
                                                            <p className="text-danger font-bold fs-16"
                                                                style={{ marginTop: '10px' }}>Hết hàng</p>
                                                        ) : (
                                                            <button
                                                                className="butn mr-2 font-semibold w-100 fs-14 rounded"
                                                                style={{
                                                                    padding: '16px',
                                                                    width: '140px',
                                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                                    backgroundColor: hotProducts.quantity === 0 ? "#dcdcdc" : "#228B22",
                                                                    color: hotProducts.quantity === 0 ? "black" : "white",
                                                                    cursor: hotProducts.quantity === 0 ? "not-allowed" : "pointer"
                                                                }}
                                                                onClick={() => handleBuyNow(hotProducts.id, cart[hotProducts.id] || 1)}
                                                                disabled={hotProducts.quantity === 0} // Disable the button if out of stock
                                                            >
                                                                <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                                                    style={{ marginRight: "6px" }}></i>Mua ngay</p>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center fs-30 text-dGreen">Không có sản phẩm để hiển thị</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid about py-2 shadow mb-3 rounded">
                        <div className="container py-5">
                            <div className="row g-5 align-items-center">
                                {/* Hình ảnh bên trái */}
                                <div className="col-lg-5">
                                    <div className="video">
                                        <img src="toner.png" className="img-fluid rounded" />
                                        <div
                                            className="position-absolute rounded border-top border-start border-white bottom-0 right-0">
                                            <img src="toner.png" width={"200px"} className="img-fluid rounded" />
                                        </div>

                                    </div>
                                </div>

                                {/* Nội dung giới thiệu */}
                                <div className="col-lg-7">
                                    <div>
                                        <p className="fs-4 text-dGreen font-semibold">Về Chúng Tôi</p>
                                        <p className="mb-4 font-bold text-dGreen fs-30">GlowMakers –
                                            Cửa hàng mỹ phẩm dưỡng da, dưỡng môi chính hãng.</p>
                                        <p className="mb-4 text-dGreen">
                                            GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và
                                            dưỡng môi
                                            cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp
                                            bạn tự
                                            tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành
                                            tính, chiết
                                            xuất từ thiên nhiên, phù hợp cho mọi loại da...
                                        </p>
                                        <NavLink to="/about"
                                            className="butn w-25 rounded py-3 px-5 font-semibold shadow">
                                            Xem thêm
                                        </NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="container-fluid py-5 bg-brand shadow mt-3 rounded">
                        <div className="container text-center">
                            <p className="font-bold mb-5 text-dGreen fs-30">Các thương
                                hiệu</p>
                            <Slider className="mb-5 position-relative" {...sliderSettings}>
                                {loading ? (
                                    Array.from({ length: 5 }).map((_, index) => (
                                        <div key={index} className="text-center">
                                            <Skeleton width={150} height={150} circle={true} />
                                            <Skeleton height={20} width={100} className="mt-2" />
                                        </div>
                                    ))
                                ) : brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <div key={brand.id}
                                            className="text-center d-flex flex-column align-items-center card-style">
                                            <div className="brand-card w-100 bg-white" style={{
                                                padding: "15px",
                                                borderRadius: "15px",
                                                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                                maxWidth: "170px",
                                                height: '170px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: "transform 0.3s ease",
                                                minWidth: "100px", // Đảm bảo độ rộng tối thiểu
                                            }}>
                                                <img src={brand.image || "https://via.placeholder.com/200"}
                                                    alt={brand.name} className="img-fluid rounded"
                                                    style={{
                                                        maxWidth: "100%", // Đảm bảo không vượt quá chiều rộng của ô
                                                        maxHeight: "100%", // Đảm bảo không vượt quá chiều cao của ô
                                                        objectFit: "contain" // Giữ nguyên tỷ lệ của hình ảnh
                                                    }} />
                                            </div>
                                            <p className="mt-2 text-dGreen fs-16" style={{
                                                fontWeight: "bold",
                                                textTransform: "uppercase"
                                            }}>
                                                {brand.name}
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-dGreen">Không có thương hiệu nào.</p>
                                )}
                            </Slider>
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
