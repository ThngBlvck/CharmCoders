import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css";
import { register } from "../../../services/User";

export default function Register() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        address: "",
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false); // Thêm trạng thái isSubmitting

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
                address: formData.address,
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
                address: "",
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

                                disabled={isSubmitting}

                            />
                            {errors.name && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.name[0]}
                                </div>
                            )}

                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}

                                disabled={isSubmitting} // Vô hiệu hóa khi đang submit
                            />
                            {errors.email && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.email[0]}
                                </div>
                            )}
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

                                disabled={isSubmitting} // Vô hiệu hóa khi đang submit
                            />
                            {errors.password && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.password[0]} {/* Hiển thị lỗi đầu tiên */}
                                </div>
                            )}
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

                                disabled={isSubmitting} // Vô hiệu hóa khi đang submit
                            />
                            {errors.password_confirmation && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.password_confirmation[0]}
                                </div>
                            )}
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

                                disabled={isSubmitting} // Vô hiệu hóa khi đang submit
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

                                disabled={isSubmitting} // Vô hiệu hóa khi đang submit
                            />
                            {errors.address && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.address[0]}
                                </div>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={isSubmitting} // Vô hiệu hóa nút khi đang submit
                        >
                            {isSubmitting ? "Đang xử lý..." : "Đăng Ký"} {/* Hiển thị trạng thái */}
                        </button>
                        <div className="mt-3 text-center">
                            <p>Đã có tài khoản? <a href="/login" className="text-decoration-none">Đăng nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
