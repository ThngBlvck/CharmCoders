import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


export default function Header() {
    return (
        <>
            <div className="container-fluid sticky-top px-0">
                <div className="container-fluid topbar d-none d-lg-block">
                    <div className="container px-0">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <div className="d-flex flex-wrap">
                                    <a href="#" className="me-4 text-light"><i
                                        className="fas fa-map-marker-alt text-primary me-2"></i>Toà nhà FPT Polytechnic,
                                        Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ</a>
                                    <a href="#" className="me-4 text-light"><i
                                        className="fas fa-phone-alt text-primary me-2"></i>+01234567890</a>
                                    <a href="#" className="text-light"><i
                                        className="fas fa-envelope text-primary me-2"></i>glowmakers@gmail.com</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}