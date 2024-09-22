import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css"; // Nếu có các kiểu riêng

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Gửi email đặt lại mật khẩu ở đây
        console.log("Yêu cầu đặt lại mật khẩu cho email:", email);
        setMessage("Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");
        setEmail("");
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Quên Mật Khẩu</h2>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control border " // Thêm border cho input
                                id="email"
                                value={email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Gửi Đường Dẫn Đặt Lại Mật Khẩu</button>
                        {message && <div className="mt-3 alert alert-success">{message}</div>}
                    </form>
                    <div className="mt-3 text-center">
                        <p>Đã nhớ mật khẩu? <a href="/login" className="text-decoration-none">Đăng nhập ngay</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
