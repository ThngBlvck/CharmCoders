import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2"; // If you want to display alerts
import { sendContactMessage } from '../../../services/Contact'; // Adjust the path as necessary

export default function Contact() {
    // State to store form data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: "",
    });

    // State to store errors (if any)
    const [errors, setErrors] = useState({});

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Simple validation
        const newErrors = {};
        if (!formData.name) newErrors.name = "Vui lòng nhập tên.";
        if (!formData.email) {
            newErrors.email = "Vui lòng nhập email.";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ."; // Validate email format
        }
        if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại.";
        else if (!/^\d+$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại chỉ được chứa chữ số."; // Validate phone format
        }
        if (!formData.message) newErrors.message = "Vui lòng nhập tin nhắn.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await sendContactMessage(formData); // Call the service
            Swal.fire("Thành công!", "Tin nhắn đã được gửi đi!", "success");
            setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
            setErrors({}); // Reset errors
        } catch (error) {
            console.error("Error sending message:", error);
            Swal.fire("Thất bại", "Có lỗi xảy ra trong quá trình gửi tin nhắn.", "error");
        }
    };


    return (
        <>
            <div className="container-fluid py-3" style={{ backgroundColor: "#fff7f8" }}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{ color: "#ffa69e", fontSize: "40px" }}>Liên hệ</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{ color: "#ffa69e" }}><NavLink to={`/home`}>Trang chủ</NavLink></li>
                        <li className="breadcrumb-item active font-bold" style={{ color: "#ffa69e" }}>Liên hệ</li>
                    </ol>
                </div>
            </div>

            <div className="container-fluid contact py-5" style={{ backgroundColor: "white", marginTop: "2rem" }}>
                <div className="container pt-1">
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-6">
                            <div className="text-center">
                                <p className="text-white mb-4 font-bold" style={{ fontSize: "2rem" }}>Liên hệ với GlowMakers</p>
                                <p className="text-white font-semibold" style={{ fontSize: "1.5rem" }}>Bạn có thắc mắc hay đóng góp, vui lòng liên hệ với chúng tôi bằng cách điền thông tin vào form bên cạnh.</p>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="contact-form rounded p-5">
                                <form onSubmit={handleSubmit}>
                                    <div className="row gx-4 gy-3">
                                        <div className="col-xl-12">
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4 rounded"
                                                placeholder="Nhập tên..."
                                            />
                                            {errors.name && <small className="text-danger">{errors.name}</small>}
                                        </div>
                                        <div className="col-xl-12">
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4 rounded"
                                                placeholder="Nhập email..."
                                            />
                                            {errors.email && <small className="text-danger">{errors.email}</small>}
                                        </div>
                                        <div className="col-xl-12">
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4 rounded"
                                                placeholder="Nhập số điện thoại..."
                                            />
                                            {errors.phone && <small className="text-danger">{errors.phone}</small>}
                                        </div>
                                        <div className="col-12">
                                            <textarea
                                                name="message"
                                                value={formData.message}
                                                onChange={handleChange}
                                                className="form-control bg-white border-0 py-3 px-4"
                                                rows="4"
                                                cols="10"
                                                placeholder="Nhập tin nhắn..."
                                            ></textarea>
                                            {errors.message && <small className="text-danger">{errors.message}</small>}
                                        </div>
                                        <div className="col-12">
                                            <button className="btn w-100 py-3 px-5 btn-submit font-semibold" style={{ backgroundColor: "#c5887e", color: "white", fontSize: "20px" }} type="submit">
                                                Gửi
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mx-auto text-center" style={{ maxWidth: "800px", marginTop: '100px' }}>
                <p className="fs-4 text-center text-primary font-bold custom-font">GlowMakers</p>
                <p className="font-bold" style={{ color: '#8c5e58', fontSize: "30px" }}>Liên hệ</p>
            </div>
            <div className="container-fluid">
                <div className="container py-5">
                    <div className="row g-4 align-items-center">
                        <div className="col-12">
                            <div className="row g-4">
                                {/* Address Box */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{ minHeight: "200px" }}>
                                        <i className="fas fa-map-marker-alt fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{ color: '#8c5e58' }}>Địa chỉ</p>
                                            <p className="mb-0 text-center" style={{ color: '#8c5e58' }}>Toà nhà FPT
                                                Polytechnic, Đ. Số 22, Thường
                                                Thạnh, Cái Răng, Cần Thơ</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Email Box */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{ minHeight: "200px" }}>
                                        <i className="fas fa-envelope fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{ color: '#8c5e58' }}>Email</p>
                                            <p className="mb-0 text-center" style={{ color: '#8c5e58' }}>glowmakers@gmail.com</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Number Box */}
                                <div className="col-md-4 d-flex justify-content-center">
                                    <div
                                        className="d-inline-flex flex-column align-items-center bg-light w-100 border border-primary p-4 rounded"
                                        style={{ minHeight: "200px" }}>
                                        <i className="fas fa-phone fa-2x text-primary mb-3"></i>
                                        <div>
                                            <p className="text-center mb-3" style={{ color: '#8c5e58' }}>Số điện thoại</p>
                                            <p className="mb-0 text-center" style={{ color: '#8c5e58' }}>0123456789</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
