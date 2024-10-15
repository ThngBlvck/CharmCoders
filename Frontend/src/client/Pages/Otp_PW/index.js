import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css"; // Nếu có các kiểu riêng

export default function VerifyOtp({ email }) {
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setOtp(e.target.value);
        setMessage(""); // Reset message khi người dùng nhập OTP
        setError(""); // Reset error khi người dùng nhập OTP
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("OTP đã nhập:", otp);
        // Logic xử lý xác minh OTP ở đây
        setMessage("OTP đã được xác minh thành công.");
        setOtp(""); // Reset OTP sau khi xác minh
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Xác Nhận OTP</h2>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <div className="mb-3">
                            <label htmlFor="otp" className="form-label">Mã OTP</label>
                            <input
                                type="text"
                                className="form-control border"
                                id="otp"
                                value={otp}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Xác Nhận OTP</button>
                        {message && <div className="mt-3 alert alert-success">{message}</div>}
                        {error && <div className="mt-3 alert alert-danger">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}
