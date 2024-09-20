import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function Contact() {
    return (
        <>
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5">
                    <h1 className="text-white display-3 mb-4">Liên hệ</h1>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
                        <li className="breadcrumb-item active text-white">Liên hệ</li>
                    </ol>
                </div>
            </div>

            <div className="container-fluid contact py-5" style={{background: "var(--bs-primary)"}}>
                <div className="container pt-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="text-center">
                                <h1 className="display-3 text-white mb-4">Liên hệ với chúng tôi</h1>
                                <p className="text-white fs-4">Nếu bạn có thắc mắc hay có góp ý gì, vui long liên hệ với
                                    chúng tôi bang cách điền thông tin vào form bên cạnh.</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="contact-form rounded p-5">
                                <form>
                                    <div className="row gx-4 gy-3">
                                        <div className="col-xl-12">
                                            <input type="text" className="form-control bg-white border-0 py-3 px-4"
                                                   placeholder="Nhập tên..."/>
                                        </div>
                                        <div className="col-xl-12">
                                            <input type="email" className="form-control bg-white border-0 py-3 px-4"
                                                   placeholder="Nhập email..."/>
                                        </div>
                                        <div className="col-xl-12">
                                            <input type="text" className="form-control bg-white border-0 py-3 px-4"
                                                   placeholder="Nhập số điện thoại..."/>
                                        </div>

                                        <div className="col-12">
                                            <textarea className="form-control bg-white border-0 py-3 px-4" rows="4"
                                                      cols="10" placeholder="Nhập tin nhắn..."></textarea>
                                        </div>
                                        <div className="col-12">
                                            <button className="btn btn-primary btn-primary-outline-0 w-100 py-3 px-5"
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
            <div className="container-fluid pb-5">
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
                                        style={{height: "450px", marginBottom: "-6px",}}
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
