import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function About() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5">
                    <h1 className="text-white display-3 mb-4">Giới thiệu</h1>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
                        <li className="breadcrumb-item active text-white">Giới thiệu</li>
                    </ol>
                </div>
            </div>

            {/* Giới thiệu và hình ảnh */}
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
                            <img src="" alt="Thanh toán khi nhận hàng" className="img-fluid mb-3"
                                 style={{width: '80px'}}/>
                            <h5>Thanh toán khi nhận hàng</h5>
                        </div>
                    </div>

                    {/* Cam kết 2 */}
                    <div className="col-md-3">
                        <div className="p-4">
                            <img src="" alt="Giao nhanh miễn phí 2H" className="img-fluid mb-3"
                                 style={{width: '80px'}}/>
                            <h5>Giao nhanh miễn phí 2H</h5>
                        </div>
                    </div>

                    {/* Cam kết 3 */}
                    <div className="col-md-3">
                        <div className="p-4">
                            <img src="" alt="30 ngày đổi trả miễn phí" className="img-fluid mb-3"
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
        </>
    );
}
