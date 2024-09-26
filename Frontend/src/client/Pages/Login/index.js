import React, { useState, useEffect } from "react";
import "../../../assets/styles/css/bootstrap.min.css";
import "../../../assets/styles/css/style.css";
import { login } from "../../../services/User"; // Đảm bảo hàm login được định nghĩa đúng
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState(""); // Trạng thái lỗi
    const [loading, setLoading] = useState(false); // Trạng thái loading

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            window.location.href = "/home";
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
    
        // Kiểm tra các trường nhập trước khi gửi yêu cầu
        if (!formData.email || !formData.password) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
            setLoading(false);
            return;
        }
    
        try {
            const response = await login(formData);
            console.log(response);
            if (response && response.token) {
                // Nếu có token trả về, lưu vào localStorage
                console.log("Token:", response.token);
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                window.location.href = "home"; 
            } else {
                setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            // Xử lý thông báo lỗi từ backend
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    // Nếu có lỗi xác thực từ backend
                    const errorMessages = Object.values(errorData.errors).flat();
                    setErrorMessage(errorMessages.join(", ")); // Hiển thị tất cả thông báo lỗi
                } else {
                    // Nếu không có lỗi xác thực cụ thể
                    setErrorMessage(errorData.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
                }
            } else {
                // Thông báo lỗi chung nếu không nhận được phản hồi từ backend
                setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }
        } finally {
            setLoading(false);
            // Giữ nguyên dữ liệu form sau khi xử lý
        }
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
                        
                        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đăng Nhập"}
                        </button>

                        {/* Hiển thị thông báo lỗi */}
                        {errorMessage && (
                            <div className="mt-3 text-danger text-center">
                                {errorMessage}
                            </div>
                        )}

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
