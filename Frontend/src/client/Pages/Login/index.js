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
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <p className="text-center mb-4 font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>Đăng
                            Nhập</p>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label font-semibold"
                                   style={{color: '#8c5e58'}}>Email</label>
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
                            <label htmlFor="password" className="form-label font-semibold" style={{color: '#8c5e58'}}>Mật
                                khẩu</label>
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
                        <div className="mt-3">
                            <a href="/forgot-password" className="text-decoration-none font-semibold"
                               style={{color: '#8c5e58'}}>Quên mật khẩu?</a>
                        </div>
                        <button type="submit" className="btn btn-primary w-100 font-semibold mt-3"
                                style={{color: '#442e2b'}}><a href="/home">Đăng Nhập</a>
                        </button>

                        {/* Google Login Button */}
                        <div className="text-center mt-3">
                            <p className="font-semibold" style={{color: '#8c5e58'}}>Hoặc đăng nhập bằng</p>
                            <a href="/login-with-google" className="btn btn-outline-danger w-100 mt-3">
                                <i className="fab fa-google me-2"></i> Đăng Nhập với Google
                            </a>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="font-semibold" style={{color: '#8c5e58'}}>Bạn chưa có tài khoản? <a
                                href="/register" className="text-decoration-none font-bold" style={{color: '#8c5e58'}}>Đăng
                                ký ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
