import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function Home() {
    // Demo sản phẩm
    const products = [
        {id: 1, name: "Product 1", price: 50, category: "Skin Care", brand: "Brand A"},
        {id: 2, name: "Product 2", price: 150, category: "Hair Care", brand: "Brand B"},
        {id: 3, name: "Product 3", price: 80, category: "Body Care", brand: "Brand C"},
        {id: 4, name: "Product 4", price: 120, category: "Nail Care", brand: "Brand A"},
        {id: 5, name: "Product 5", price: 40, category: "Skin Care", brand: "Brand B"},
        {id: 6, name: "Product 6", price: 300, category: "Hair Care", brand: "Brand C"},
        {id: 7, name: "Product 7", price: 90, category: "Body Care", brand: "Brand A"},
        {id: 8, name: "Product 8", price: 200, category: "Nail Care", brand: "Brand B"}
    ];

    return (
        <>
            <div className="container-fluid services py-5">
                <div className="container py-5">
                    <div className="mx-auto text-center mb-5" style={{maxWidth: "800px"}}>
                        <p className="fs-4 text-uppercase text-center text-primary">Glow Makers</p>
                        <h1 className="display-3">Các sản phẩm mới nhất</h1>
                    </div>
                    <div className="row g-4">
                        <div className="row">
                            {products.map((product) => (
                                <div key={product.id} className="col-md-6 col-lg-3 mb-4">
                                    <div className="card text-center" style={{borderRadius: '15px', padding: '20px'}}>
                                        <img
                                            src="https://via.placeholder.com/300"
                                            className="card-img-top img-fluid rounded"
                                            alt="Product"
                                            style={{maxHeight: '200px', objectFit: 'cover'}}
                                        />
                                        <div className="card-body">
                                            <h3 className="card-title">{product.name}</h3>
                                            <p className="card-text">{product.price}đ</p>
                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-primary">Mua ngay</button>
                                                <button className="btn btn-secondary">Thêm vào giỏ</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-12">
                            <div className="services-btn text-center">
                                <a href="#" className="btn btn-primary btn-primary-outline-0 rounded-pill py-3 px-5">Service
                                    More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid about py-5">
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
                                <button type="button" className="btn btn-play" data-bs-toggle="modal"
                                        data-src="https://www.youtube.com/embed/DWRcNpR6Kdc"
                                        data-bs-target="#videoModal">
                                    <span></span>
                                </button>
                            </div>
                        </div>

                        {/* Nội dung giới thiệu */}
                        <div className="col-lg-7">
                            <div>
                                <p className="fs-4 text-uppercase text-primary">About Us</p>
                                <h1 className="display-4 mb-4">Your Best Spa, Beauty & Skin Care Center</h1>
                                <p className="mb-4">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                                <p className="mb-4">
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                                <a href="#" className="btn btn-primary btn-primary-outline-0 rounded-pill py-3 px-5">
                                    Explore More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 ô cam kết */}
            <div className="container py-5">
                <div className="row text-center">
                    {/* Cam kết 1 */}
                    <div className="col-md-3">
                        <div className="p-4">
                            <img src="/mnt/data/image.png" alt="Thanh toán khi nhận hàng" className="img-fluid mb-3"
                                 style={{width: '80px'}}/>
                            <h5>Thanh toán khi nhận hàng</h5>
                        </div>
                    </div>

                    {/* Cam kết 2 */}
                    <div className="col-md-3">
                        <div className="p-4">
                            <img src="/mnt/data/image.png" alt="Giao nhanh miễn phí 2H" className="img-fluid mb-3"
                                 style={{width: '80px'}}/>
                            <h5>Giao nhanh miễn phí 2H</h5>
                        </div>
                    </div>

                    {/* Cam kết 3 */}
                    <div className="col-md-3">
                        <div className="p-4">
                            <img src="/mnt/data/image.png" alt="30 ngày đổi trả miễn phí" className="img-fluid mb-3"
                                 style={{width: '80px'}}/>
                            <h5>30 ngày đổi trả miễn phí</h5>
                        </div>
                    </div>

                    {/* Cam kết 4 - Tư vấn 24/7 */}
                    <div className="col-md-3">
                        <div className="p-4">
                            <img src="https://via.placeholder.com/80" alt="Tư vấn 24/7" className="img-fluid mb-3"
                                 style={{width: '80px'}}/>
                            <h5>Tư vấn 24/7</h5>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-12">
                            <div className="row g-4">
                                <div className="col-lg-4">
                                    <div className="d-inline-flex bg-light w-100 border border-primary p-4 rounded">
                                        <i className="fas fa-map-marker-alt fa-2x text-primary me-4"></i>
                                        <div>
                                            <h4>Địa chỉ</h4>
                                            <p className="mb-0">Toà nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái
                                                Răng, Cần Thơ</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="d-inline-flex bg-light w-100 border border-primary p-4 rounded">
                                        <i className="fas fa-envelope fa-2x text-primary me-4"></i>
                                        <div>
                                            <h4>Email</h4>
                                            <p className="mb-0">glowmakers@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="d-inline-flex bg-light w-100 border border-primary p-4 rounded">
                                        <i className="fa fa-phone-alt fa-2x text-primary me-4"></i>
                                        <div>
                                            <h4>Số điện thoại</h4>
                                            <p className="mb-0">(+012) 3456 7890 123</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="rounded">
                                <iframe className="rounded-top w-100"
                                        style={{height: "450px", marginBottom: "-6px"}}
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31579.19291850749!2d105.76173499999999!3d10.0068791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a0880a872e399f%3A0x6e15bcb1047b66c7!2sFPT%20Polytechnic%2C%20%C4%90.%20S%E1%BB%91%2022%2C%20Th%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1nh%2C%20C%C3%A1i%20R%C4%83ng%2C%20C%E1%BA%A7n%20Th%C6%A1!5e0!3m2!1sen!2sbd!4v1694262704123!5m2!1sen!2sbd"
                                        loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}
