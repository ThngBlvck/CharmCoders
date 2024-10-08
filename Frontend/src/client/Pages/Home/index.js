import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { NavLink } from "react-router-dom";
import Slider from "react-slick"; // Đảm bảo bạn đã cài đặt react-slick và slick-carousel

export default function Home() {
    // Demo sản phẩm
    const products = [
        { id: 1, name: "Product 1", price: 500000, category: "Skin Care", brand: "Brand A" },
        { id: 2, name: "Product 2", price: 150000, category: "Hair Care", brand: "Brand B" },
        { id: 3, name: "Product 3", price: 800000, category: "Body Care", brand: "Brand C" },
        { id: 4, name: "Product 4", price: 120000, category: "Nail Care", brand: "Brand A" },
        { id: 5, name: "Product 5", price: 400000, category: "Skin Care", brand: "Brand B" },
        { id: 6, name: "Product 6", price: 300000, category: "Hair Care", brand: "Brand C" },
        { id: 7, name: "Product 7", price: 900000, category: "Body Care", brand: "Brand A" },
        { id: 8, name: "Product 8", price: 200000, category: "Nail Care", brand: "Brand B" }
    ];

    // Dữ liệu thương hiệu
    const brands = [
        { id: 1, name: "Brand A", img: "https://via.placeholder.com/150" },
        { id: 2, name: "Brand B", img: "https://via.placeholder.com/150" },
        { id: 3, name: "Brand C", img: "https://via.placeholder.com/150" },
        { id: 4, name: "Brand D", img: "https://via.placeholder.com/150" },
        { id: 5, name: "Brand E", img: "https://via.placeholder.com/150" },
        { id: 6, name: "Brand F", img: "https://via.placeholder.com/150" }
    ];

    // Cấu hình cho slider
    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true, // Bật chế độ tự động
        autoplaySpeed: 1000, // Thay đổi slide mỗi 2 giây
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

    return (
        <>
            <div className="container-fluid services py-1 d-flex">
            <div className="container py-5">
                    <div className="mx-auto text-center mb-5" style={{ maxWidth: "800px" }}>
                        <p className="fs-4 text-center text-primary font-bold custom-font">GlowMakers</p>
                        <p className="font-bold" style={{ color: '#8c5e58', fontSize: "30px" }}>Các sản phẩm mới nhất</p>
                    </div>
                    <div className="row g-4">
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.id} className="col-md-6 col-lg-3 mb-3">
                                    <div className="card text-center bg-hover" style={{ borderRadius: '15px', padding: '20px' }}>
                                        <NavLink to={`/products/${product.id}`}>
                                            <img
                                                src="https://via.placeholder.com/500"
                                                className="card-img-top img-fluid rounded"
                                                alt="Product"
                                                style={{ maxHeight: '500px', objectFit: 'cover' }}
                                            />
                                        </NavLink>
                                        <div className="card-body">
                                            <NavLink to={`/products/${product.id}`}>
                                                <p className="card-title font-semibold" style={{ color: '#8c5e58' }}>{product.name}</p>
                                            </NavLink>
                                            <p className="card-text mb-4 font-semibold" style={{ color: '#8c5e58' }}>{product.price.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</p>

                                            <NavLink to={`/products/${product.id}`} className="w-100">
                                                <button className="btn btn-primary mr-2 font-bold w-100" style={{
                                                    padding: '14px',
                                                    fontSize: '13px',
                                                    color: '#442e2b'
                                                }}><p>Xem chi tiết</p></button>
                                            </NavLink>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Thương Hiệu */}
            <div className="container-fluid py-5" style={{ backgroundColor: '#f9f9f9' }}>
                <div className="container text-center">
                    {/* Tiêu đề */}
                    <p className="font-bold mb-5" style={{ color: '#8c5e58', fontSize: "30px" }}>Các thương hiệu</p>

                    {/* Slider */}
                    <Slider className="mb-5 position-relative" {...sliderSettings}>
                        {brands.map((brand) => (
                            <div key={brand.id} className="text-center d-flex flex-column align-items-center card-style">

                                {/* Card với logo */}
                                <div className="brand-card" style={{
                                    padding: '15px',
                                    backgroundColor: '#fff',
                                    borderRadius: '15px',
                                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                    maxWidth: '200px',
                                    transition: 'transform 0.3s ease',
                                }}>
                                    <img src={brand.img} alt={brand.name} className="img-fluid rounded"
                                         style={{ width: '100%', height: 'auto', marginBottom: '10px' }} />
                                </div>

                                {/* Tên thương hiệu */}
                                <p className="mt-2" style={{
                                    color: '#8c5e58',
                                    fontWeight: 'bold',
                                    fontSize: '16px',
                                    textTransform: 'uppercase',
                                }}>{brand.name}</p>
                            </div>
                        ))}
                    </Slider>

                    {/* Nút xem tất cả */}
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
                                <img src="https://via.placeholder.com/400x300" className="img-fluid rounded" alt="About Us" />
                                <div className="position-absolute rounded border-5 border-top border-start border-white" style={{ bottom: '0', right: '0' }}>
                                    <img src="https://via.placeholder.com/200x150" className="img-fluid rounded" alt="Extra Image" />
                                </div>
                            </div>
                        </div>

                        {/* Nội dung giới thiệu */}
                        <div className="col-lg-7">
                            <div>
                                <p className="fs-4 text-primary font-semibold custom-font">Về Chúng Tôi</p>
                                <p className="mb-4 font-bold" style={{ color: '#8c5e58', fontSize: "30px" }}>GlowMakers – Cửa hàng mỹ phẩm dưỡng da, dưỡng môi chính hãng.</p>
                                <p className="mb-4" style={{ color: '#8c5e58' }}>
                                    GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và dưỡng môi cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp bạn tự tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành tính, chiết xuất từ thiên nhiên, phù hợp cho mọi loại da...
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
            <div className="container py-5 d-flex justify-content-center" style={{ fontFamily: 'Roboto, sans-serif' }}>
                <div className="row text-center">
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{ backgroundColor: '#fff7f8' }}>
                            <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng" className="img-fluid mb-3 rounded" style={{ width: '150px', objectFit: 'cover' }} />
                            <p style={{ color: '#8c5e58' }} className="font-bold">Thanh toán khi nhận hàng</p>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{ backgroundColor: '#fff7f8' }}>
                            <img src="https://via.placeholder.com/150x150" alt="Thương hiệu uy tín toàn cầu" className="img-fluid mb-3 rounded" style={{ width: '150px', objectFit: 'cover' }} />
                            <p style={{ color: '#8c5e58' }} className="font-bold">Thương hiệu uy tín toàn cầu</p>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{ backgroundColor: '#fff7f8' }}>
                            <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí" className="img-fluid mb-3 rounded" style={{ width: '150px', objectFit: 'cover' }} />
                            <p style={{ color: '#8c5e58' }} className="font-bold">30 ngày đổi trả miễn phí</p>
                        </div>
                    </div>
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center border border-primary w-100" style={{ backgroundColor: '#fff7f8' }}>
                            <img src="https://via.placeholder.com/150x150" alt="Sản phẩm chính hãng 100%" className="img-fluid mb-3 rounded" style={{ width: '150px', objectFit: 'cover' }} />
                            <p style={{ color: '#8c5e58' }} className="font-bold">Sản phẩm chính hãng 100%</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
