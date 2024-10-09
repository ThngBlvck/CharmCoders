import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css";
import { register } from "../../../services/User";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");
        setIsSubmitting(true);

        if (formData.password !== formData.confirmPassword) {
            setErrors({ confirmPassword: ["Mật khẩu không khớp"] });
            setIsSubmitting(false);
            return;
        }

        try {
            const dataToSend = {
                name: formData.fullName,
                email: formData.email,
                password: formData.password,
                password_confirmation: formData.confirmPassword,
            };

            const data = await register(dataToSend);
            console.log("Đăng ký thành công:", data);
            setSuccessMessage("Đăng ký thành công!");

            // Reset form data
            setFormData({
                fullName: "",
                email: "",
                password: "",
                confirmPassword: "",
                phoneNumber: "",
            });
        } catch (error) {
            // Xử lý lỗi từ backend
            if (error.errors) {
                setErrors(error.errors); // Giả định backend trả về các lỗi theo định dạng này
            } else {
                setErrors({ message: error.message }); // Lỗi khác
            }
            console.error("Error during registration:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <p className="text-center mb-4 font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>Đăng
                            Ký</p>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label font-semibold"
                                   style={{color: '#8c5e58'}}>Họ và Tên</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                
                            />
                            {errors.name && (
                                    <div className="text-danger mt-2" role="alert">
                                        {errors.name[0]}
                                    </div>
                                )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label font-semibold"
                                   style={{color: '#8c5e58'}}>Email</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                               
                            />
                             {errors.email && (
                                    <div className="text-danger mt-2" role="alert">
                                        {errors.email[0]}
                                    </div>
                                )}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label font-semibold"
                                   style={{color: '#8c5e58'}}>Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                    <div className="text-danger mt-2" role="alert">
                                        {errors.password[0]}
                                    </div>
                                )}
                            
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label font-semibold"
                                   style={{color: '#8c5e58'}}>Xác nhận Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                
                            />
                            {errors.password_confirmation && (
                                    <div className="text-danger mt-2" role="alert">
                                        {errors.password_confirmation[0]}
                                    </div>
                                )}
                        </div>
                        <button type="submit" className="btn btn-primary w-100 font-semibold mt-1"
                                style={{color: '#442e2b'}}><a href="/login">Đăng Ký</a>
                        </button>
                        {/* Google Login Button */}
                        <div className="text-center mt-3">
                            <p className="font-semibold" style={{color: '#8c5e58'}}>Hoặc đăng nhập bằng</p>
                            <a href="/login-with-google" className="btn btn-outline-danger w-100 mt-3">
                                <i className="fab fa-google me-2"></i> Đăng Nhập với Google
                            </a>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="font-semibold" style={{color: '#8c5e58'}}>Bạn đã có tài khoản? <a
                                href="/login" className="text-decoration-none font-bold" style={{color: '#8c5e58'}}>Đăng
                                nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
