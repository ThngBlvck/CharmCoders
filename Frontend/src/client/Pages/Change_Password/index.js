import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { changePassword } from "../../../services/User"; // Adjust path if needed
import { useNavigate } from "react-router-dom";
import {toast} from "react-toastify";

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
        toast.success("Mật khẩu của bạn đã được thay đổi thành công.");
        setFormData({
            current_password: "",
            new_password: "",
            new_password_confirmation: ""
        });
        navigate("/profile");
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

                // Show success message from the backend response
                toast.success(response?.data?.message || "Mật khẩu của bạn đã được thay đổi thành công!");

                // Reset form fields after successful submission
                setFormData({
                    current_password: "",
                    new_password: "",
                    new_password_confirmation: ""
                });
                navigate("/profile");

            } catch (error) {
                console.error("Error during password change:", error);

                // Show error message from the backend, fallback to default message if not available
                toast.error(`${error?.response?.data?.message || error.message || 'Vui lòng thử lại sau.'}`);
            }
        } else {
            // If validation fails, show an error message
            toast.error("Vui lòng kiểm tra lại các trường nhập liệu và đảm bảo các mật khẩu khớp.");
        }
    };







    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="p-4 bg-light border rounded shadow">
                        <p className="text-center mb-4 text-dGreen fs-30 font-semibold">Đổi mật khẩu</p>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label htmlFor="current_password" className="form-label text-dGreen font-semibold fs-16">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    name="current_password"
                                    id="current_password"
                                    className={`form-control rounded ${errors.current_password ? "is-invalid" : ""}`}
                                    value={formData.current_password}
                                    onChange={handleChange}
                                />
                                {errors.current_password && <div className="invalid-feedback">{errors.current_password}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="new_password" className="form-label text-dGreen font-semibold fs-16">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="new_password"
                                    id="new_password"
                                    className={`form-control rounded ${errors.new_password ? "is-invalid" : ""}`}
                                    value={formData.new_password}
                                    onChange={handleChange}
                                />
                                {errors.new_password && <div className="invalid-feedback">{errors.new_password}</div>}
                            </div>
                            <div className="form-group mb-3">
                                <label htmlFor="new_password_confirmation" className="form-label text-dGreen font-semibold fs-16">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    name="new_password_confirmation"
                                    id="new_password_confirmation"
                                    className={`form-control rounded ${errors.new_password_confirmation ? "is-invalid" : ""}`}
                                    value={formData.new_password_confirmation}
                                    onChange={handleChange}
                                />
                                {errors.new_password_confirmation && (
                                    <div className="invalid-feedback">{errors.new_password_confirmation}</div>
                                )}
                            </div>
                            <button type="submit" className="butn rounded shadow w-100 font-semibold mt-3">
                                Xác nhận thay đổi
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
