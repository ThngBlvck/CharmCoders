import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css";
import { register } from "../../../services/User";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccessMessage("");
        setIsSubmitting(true);

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
            });
            navigate("/login");
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
                        <p className="text-center mb-2 font-bold text-dGreen fs-30">Đăng
                            Ký</p>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label font-semibold text-dGreen">Họ và Tên</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded"
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
                            <label htmlFor="email" className="form-label font-semibold text-dGreen">Email</label>
                            <input
                                type="text"
                                className="form-control border-0 shadow-sm rounded"
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
                            <label htmlFor="password" className="form-label font-semibold text-dGreen">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm rounded"
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
                            <label htmlFor="confirmPassword" className="form-label font-semibold text-dGreen">Xác nhận Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm rounded"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}

                            />
                            {errors.password && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.password[0]}
                                </div>
                            )}
                        </div>
                        <button type="submit" className="butn shadow rounded w-100 font-semibold mt-1">Đăng Ký
                        </button>
                        <div className="mt-3 text-center">
                            <p className="font-semibold text-dGreen">Bạn đã có tài khoản? <a
                                href="/login" className="text-decoration-none font-bold lg-now">Đăng
                                nhập ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
