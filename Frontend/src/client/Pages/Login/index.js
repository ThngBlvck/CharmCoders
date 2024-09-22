import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css";
import "../../../assets/styles/css/style.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure FontAwesome is imported for the icon

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu đăng nhập:", formData);
        // Xử lý đăng nhập ở đây
        setFormData({ email: "", password: "" });
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Đăng Nhập</h2>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
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
                        <button type="submit" className="btn btn-primary w-100">Đăng Nhập</button>

                        {/* Google Login Button */}
                        <div className="text-center mt-3">
                            <p>Hoặc đăng nhập bằng</p>
                            <a href="/login-with-google" className="btn btn-outline-danger w-100">
                                <i className="fab fa-google me-2"></i> Đăng Nhập với Google
                            </a>
                        </div>

                        <div className="mt-3 text-center">
                            <a href="/forgot-password" className="text-decoration-none">Quên mật khẩu?</a>
                        </div>
                        <div className="mt-3 text-center">
                            <p>Bạn chưa có tài khoản? <a href="/register" className="text-decoration-none">Đăng ký ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
