import React from "react";
import { Link } from "react-router-dom";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";

export default function Page404() {
    return (
        <>
            <div className="container-fluid py-5">
                <div className="container py-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
                            <p className="display-1 text-dGreen">404</p>
                            <p className="mb-4 text-dGreen">Page Not Found</p>
                            <p className="mb-4 text-dGreen">Rất tiếc, trang bạn tìm kiếm không tồn tại ở trang web của
                                chúng tôi! Có thể truy cập trang chủ của chúng tôi hoặc thử sử dụng tìm kiếm?</p>
                            <div className="d-flex justify-center">
                                <Link className="butn rounded-pill w-50 py-3 px-5"
                                      to="/home">Quay Về Trang Chủ</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
