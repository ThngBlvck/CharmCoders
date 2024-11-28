import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../../../assets/styles/css/bootstrap.min.css";
import "../../../assets/styles/css/style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function PaymentResult() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const resultCode = queryParams.get("resultCode");
        const message = queryParams.get("message");

        // Kiểm tra nếu không có resultCode hoặc resultCode khác 0 (thành công)
        if (!resultCode || resultCode !== "0") {
            navigate("/404"); // Điều hướng đến trang 404 nếu không thành công
        }
    }, [location, navigate]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="border rounded p-4 shadow bg-light text-center">
                        <i className="fas fa-check-circle text-success fs-50"></i>
                        <p className="mt-4 text-dGreen font-semibold fs-20">Đặt Hàng Thành Công!</p>
                        <p className="mt-3 text-dGreen fs-18">
                            Cảm ơn bạn đã mua hàng của chúng tôi. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức.
                        </p>
                        <div className="d-flex justify-center gap-2">
                            <div>
                                <a href="/home" className="butn rounded shadow w-40 mt-4">
                                    Về Trang Chủ
                                </a>
                            </div>
                            <div>
                                <a href="/products" className="butn rounded shadow w-40 mt-4">
                                    Mua Thêm
                                </a>
                            </div>
                            <div>
                                <a href="/order-list" className="butn rounded shadow w-40 mt-4">
                                    Xem Đơn Hàng
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
