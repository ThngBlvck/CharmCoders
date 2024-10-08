import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";


export default function Contact() {
    return (
        <>
            <div className="container-fluid py-3" style={{backgroundColor: "#fff7f8"}}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{color: "#ffa69e", fontSize: "40px"}}>Liên hệ</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{color: "#ffa69e"}}><NavLink to={`/home`}>Trang
                            chủ</NavLink></li>
                        <li className="breadcrumb-item active font-bold" style={{color: "#ffa69e"}}>Liên hệ</li>
                    </ol>
                </div>
            </div>

            <div className="container-fluid contact py-5" style={{backgroundColor: "#f8c7c2", marginTop: "2rem"}}>
                <div className="container pt-1">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="text-center">
                                <p className="text-white mb-4 font-bold" style={{fontSize: "2rem"}}>Liên hệ với GlowMakers</p>
                                <p className="text-white font-semibold" style={{fontSize: "1.5rem"}}>Bạn có thắc mắc hay đóng góp, vui lòng liên hệ với
                                    chúng tôi bằng cách điền thông tin vào form bên cạnh.</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="contact-form rounded p-5">
                                <form>
                                    <div className="row gx-4 gy-3">
                                        <div className="col-xl-12">
                                            <input type="text" className="form-control bg-white border-0 py-3 px-4 rounded"
                                                   placeholder="Nhập tên..."/>
                                        </div>
                                        <div className="col-xl-12">
                                            <input type="email" className="form-control bg-white border-0 py-3 px-4 rounded"
                                                   placeholder="Nhập email..."/>
                                        </div>
                                        <div className="col-xl-12">
                                            <input type="text" className="form-control bg-white border-0 py-3 px-4 rounded"
                                                   placeholder="Nhập số điện thoại..."/>
                                        </div>

                                        <div className="col-12">
                                            <textarea className="form-control bg-white border-0 py-3 px-4" rows="4"
                                                      cols="10" placeholder="Nhập tin nhắn..."></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn w-100 py-3 px-5 btn-submit font-semibold"
                                                    style={{backgroundColor: "#c5887e", color: "white", fontSize: "20px"}}
                                                    type="submit">Gửi
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto text-center" style={{maxWidth: "800px", marginTop: '100px'}}>
                <p className="fs-4 text-center text-primary font-bold custom-font">GlowMakers</p>
                <p className="font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>Liên hệ</p>
            </div>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-12">
                            <div className="row g-4">
                                {/* Ô Địa chỉ */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{color: '#8c5e58'}}>Địa chỉ</p>
                                            <p className="mb-0 text-center" style={{color: '#8c5e58'}}>Toà nhà FPT
                                                Polytechnic, Đ. Số 22, Thường
                                                Thạnh, Cái Răng, Cần Thơ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ô Email */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{color: '#8c5e58'}}>Email</p>
                                            <p className="mb-0 text-center"
                                               style={{color: '#8c5e58'}}>glowmakers@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Ô Số điện thoại */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{minHeight: "200px"}}>
                                        <i className="fa fa-phone-alt fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{color: '#8c5e58'}}>Số điện thoại</p>
                                            <p className="mb-0 text-center" style={{color: '#8c5e58'}}>(+012) 3456 7890
                                                123</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
