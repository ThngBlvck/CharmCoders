import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";


export default function About() {
    return (
        <>
            {/* Breadcrumb */}
            <div className="container-fluid py-3" style={{backgroundColor: "#fff7f8"}}>
                <div className="container text-center py-5">
                    <p className="display-3 mb-4" style={{color: "#ffa69e"}}>Giới thiệu</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{color: "#ffa69e"}}><NavLink to={`/home`}>Trang chủ</NavLink></li>
                        <li className="breadcrumb-item active font-bold" style={{color: "#ffa69e"}}>Giới thiệu</li>
                    </ol>
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

                            </div>
                        </div>

                        {/* Nội dung giới thiệu */}
                        <div className="col-lg-7">
                            <div>
                                <p className="fs-4 text-uppercase text-primary">About Us</p>
                                <p className="display-4 mb-4" style={{color: '#8c5e58'}}>Your Best Spa, Beauty & Skin
                                    Care
                                    Center</p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                                <p className="mb-4" style={{color: '#8c5e58'}}>
                                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 ô cam kết */}
            <div className="container py-5 d-flex justify-content-center" style={{fontFamily: 'Roboto, sans-serif'}}>
                {/* Container for Cam kết */}
                <div className="row text-center">
                    {/* Cam kết 1 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng"
                                 className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Thanh toán khi nhận hàng</p>
                        </div>
                    </div>

                    {/* Cam kết 2 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Giao nhanh miễn phí 2H"
                                 className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Giao nhanh miễn phí 2H</p>
                        </div>
                    </div>

                    {/* Cam kết 3 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí"
                                 className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">30 ngày đổi trả miễn phí</p>
                        </div>
                    </div>

                    {/* Cam kết 4 */}
                    <div className="col-3 d-flex justify-content-center">
                        <div className="p-4 d-flex flex-column align-items-center" style={{
                            backgroundColor: 'white'
                        }}>
                            <img src="https://via.placeholder.com/150x150" alt="Tư vấn 24/7" className="img-fluid mb-3"
                                 style={{width: '150px', objectFit: 'cover'}}/>
                            <p style={{color: '#8c5e58'}} className="font-bold">Tư vấn 24/7</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
