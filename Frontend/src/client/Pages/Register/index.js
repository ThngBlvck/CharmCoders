import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css"
export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Kiểm tra và xử lý đăng ký ở đây
        console.log("Dữ liệu đăng ký:", formData);
        setFormData({
            fullName: "",
            email: "",
            password: "",
            confirmPassword: "",
            phoneNumber: "",
            address: "",
        });
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Đăng Ký Tài Khoản</h2>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">Họ và Tên</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control border-0 shadow-sm"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Xác nhận Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phoneNumber" className="form-label">Số điện thoại</label>
                            <input
                                type="number"
                                className="form-control border-0 shadow-sm"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">Địa chỉ</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Đăng Ký</button>
                        <div className="mt-3 text-center">
                            <p>Đã có tài khoản? <a href="/login" className="text-decoration-none">Đăng nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
