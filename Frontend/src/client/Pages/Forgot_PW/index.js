import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate from react-router-dom
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css"; // Nếu có các kiểu riêng
import { sendOtp } from '../../../services/User'; // Adjust the import path according to your file structure

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // To handle errors
    const navigate = useNavigate(); // Initialize useNavigate

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call sendOtp and await its response
            const response = await sendOtp(email);
            // Assuming the response has a success message, you can adjust as needed
            setMessage("Đường dẫn đặt lại mật khẩu đã được gửi đến email của bạn.");

            // Redirect to the VerifyOtp page after a successful OTP send
            setTimeout(() => {
                navigate('/otp-password', { state: { email } }); // Pass the email to VerifyOtp component
            }, 2000); // Delay of 2 seconds before redirecting
        } catch (error) {
            // Handle the error case
            setErrorMessage("Đã xảy ra lỗi, vui lòng thử lại."); // Display a user-friendly error message
        } finally {
            setEmail(""); // Clear the email field
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Quên Mật Khẩu</h2>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control border" // Thêm border cho input
                                id="email"
                                value={email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Gửi Đường Dẫn Đặt Lại Mật Khẩu</button>
                        {message && <div className="mt-3 alert alert-success">{message}</div>}
                        {errorMessage && <div className="mt-3 alert alert-danger">{errorMessage}</div>} {/* Show error message if any */}
                    </form>
                    <div className="mt-3 text-center">
                        <p>Đã nhớ mật khẩu? <a href="/login" className="text-decoration-none">Đăng nhập ngay</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
