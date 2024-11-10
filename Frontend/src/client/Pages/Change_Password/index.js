import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import Swal from "sweetalert2";
import { changePassword } from "../../../services/User"; // Adjust path if needed
import { useNavigate } from "react-router-dom";

export default function ChangePassword() {
    const [formData, setFormData] = useState({
        current_password: "",
        new_password: "",
        new_password_confirmation: ""
    });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.current_password) formErrors.current_password = "Vui lòng nhập mật khẩu hiện tại";
        if (!formData.new_password) formErrors.new_password = "Vui lòng nhập mật khẩu mới";
        if (formData.new_password !== formData.new_password_confirmation) {
            formErrors.new_password_confirmation = "Mật khẩu xác nhận không khớp";
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Thành công!",
            text: "Mật khẩu của bạn đã được thay đổi thành công.",
            icon: "success",
            confirmButtonText: "Đóng"
        }).then(() => {
            // Reset form fields
            setFormData({
                current_password: "",
                new_password: "",
                new_password_confirmation: ""
            });

            // Optionally navigate to another page
            navigate("/profile"); // Redirect to profile page (or any other page)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Perform form validation
        if (validateForm()) {
            console.log("Form Data Before Submit:", formData); // Log form data

            try {
                // Send the form data to the backend for password change
                const response = await changePassword(formData);

                // Log the response from the backend
                console.log("Password Change Response:", response);

                // Check if the response indicates success
                if (response.status === 200) {
                    // Show success message
                    Swal.fire({
                        title: "Thành công!",
                        text: "Mật khẩu của bạn đã được thay đổi thành công.",
                        icon: "success",
                        confirmButtonText: "Đóng"
                    }).then(() => {
                        // Reset form fields after success
                        setFormData({
                            current_password: "",
                            new_password: "",
                            new_password_confirmation: ""
                        });

                        // Redirect to the profile page (or any other page you want)
                        navigate("/profile"); // Ensure navigate is called inside this .then()
                    });
                }
            } catch (error) {
                // Log the error object
                console.error("Password Change Error:", error);

                // Check if there's an error response and handle accordingly
                if (error.response && error.response.status === 400) {
                    const errorMessage = error.response.data.error;
                    // Handle specific error for social login or other errors
                    if (errorMessage === "Không thể thay đổi mật khẩu cho tài khoản đăng nhập qua mạng xã hội.") {
                        Swal.fire("Lỗi!", errorMessage, "error");
                    } else {
                        // Handle other error messages
                        Swal.fire("Lỗi!", errorMessage || "Có lỗi xảy ra khi đổi mật khẩu", "error");
                    }
                } else {
                    // Fallback for unexpected errors
                    Swal.fire("Lỗi!", "Có lỗi xảy ra khi đổi mật khẩu", "error");
                }
            }
        } else {
            // If validation fails, show an error message
            Swal.fire("Lỗi!", "Vui lòng kiểm tra lại các trường nhập liệu", "error");
        }
    };



    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="p-4 bg-light border rounded shadow-sm">
                        <h3 className="text-center mb-4" style={{ color: "#8c5e58" }}>Đổi mật khẩu</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="current_password" className="form-label">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    id="current_password"
                                    className={`form-control ${errors.current_password ? "is-invalid" : ""}`}
                                    value={formData.current_password}
                                    onChange={handleChange}
                                />
                                {errors.current_password && <div className="invalid-feedback">{errors.current_password}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="new_password" className="form-label">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    id="new_password"
                                    className={`form-control ${errors.new_password ? "is-invalid" : ""}`}
                                    value={formData.new_password}
                                    onChange={handleChange}
                                />
                                {errors.new_password && <div className="invalid-feedback">{errors.new_password}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="new_password_confirmation" className="form-label">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    id="new_password_confirmation"
                                    className={`form-control ${errors.new_password_confirmation ? "is-invalid" : ""}`}
                                    value={formData.new_password_confirmation}
                                    onChange={handleChange}
                                />
                                {errors.new_password_confirmation && (
                                    <div className="invalid-feedback">{errors.new_password_confirmation}</div>
                                )}
                            </div>
                            <button type="submit" className="btn btn-primary w-100 font-semibold mt-3">
                                Xác nhận thay đổi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
