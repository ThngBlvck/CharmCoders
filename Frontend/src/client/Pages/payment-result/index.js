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
                        <i className="fas fa-check-circle text-success" style={{ fontSize: '50px' }}></i>
                        <h2 className="mt-4" style={{ color: '#8c5e58' }}>Thanh Toán Thành Công!</h2>
                        <p className="mt-3" style={{ color: '#8c5e58', fontSize: "18px" }}>
                            Cảm ơn bạn đã hoàn tất thanh toán. Chúng tôi sẽ xử lý đơn hàng của bạn ngay lập tức.
                        </p>
                        <a href="/home" className="btn btn-primary mt-4" style={{ backgroundColor: '#8c5e58', borderColor: '#8c5e58' }}>
                            Về Trang Chủ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
