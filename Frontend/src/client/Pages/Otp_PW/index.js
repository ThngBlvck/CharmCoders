import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resetPassword } from "../../../services/User"; // Import API calls for OTP verification and password reset
import "../../../assets/styles/css/bootstrap.min.css";
import "../../../assets/styles/css/style.css";

export default function VerifyOtpAndResetPassword({ email }) {
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [otpVerified, setOtpVerified] = useState(false); // State to track OTP verification
    const navigate = useNavigate();

    // Handle OTP change
    const handleChangeOtp = (e) => {
        setOtp(e.target.value);
        setMessage("");
        setError("");
    };

    // Handle new password change
    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
        setError("");
        setMessage("");
    };

    // Handle confirm password change
    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
        setError("");
        setMessage("");
    };

    // Submit OTP for verification
    const handleSubmitOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await verifyOtp(email, otp); // Verify OTP
            console.log("OTP verified:", response);
            setMessage("OTP đã được xác minh thành công.");

            // Lưu email vào localStorage để sử dụng cho bước đặt lại mật khẩu
            localStorage.setItem("reset_email", email);

            setOtpVerified(true); // OTP verified, proceed to reset password
        } catch (error) {
            console.error("OTP verification failed:", error.response ? error.response.data : error);
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message || "OTP không hợp lệ hoặc đã hết hạn.");
            } else {
                setError("Đã xảy ra lỗi. Vui lòng thử lại sau.");
            }
        }
    };

    // Submit new password
    const handleSubmitNewPassword = async (e) => {
        e.preventDefault();

        // Lấy email từ localStorage
        const savedEmail = localStorage.getItem("reset_email");
        if (!savedEmail) {
            setError("Email không tồn tại. Vui lòng thử lại quá trình đặt lại mật khẩu.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const response = await resetPassword({ email: savedEmail, otp, password: newPassword, password_confirmation: confirmPassword });
            console.log("Reset password response:", response);
            setMessage("Mật khẩu đã được đặt lại thành công.");

            // Xóa email khỏi localStorage sau khi mật khẩu được đặt lại
            localStorage.removeItem("reset_email");

            // Redirect to login page after successful password reset
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            console.error("Lỗi đặt lại mật khẩu:", error.response ? error.response.data : error);
            if (error.response && error.response.status === 400) {
                setError(error.response.data.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra và thử lại.");
            } else {
                setError("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.");
            }
        }
    };

    return (
        <div className="container py-5">
            <p className="text-center mb-4 text-dGreen fs-30 font-semibold">Xác Nhận OTP</p>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    {!otpVerified ? (
                        // OTP Verification Form
                        <form onSubmit={handleSubmitOtp} className="border rounded p-4 shadow bg-light">
                            <div className="mb-3">
                                <label htmlFor="otp" className="form-label text-dGreen font-semibold fs-16">Mã OTP</label>
                                <input
                                    type="text"
                                    className="form-control border rounded"
                                    id="otp"
                                    value={otp}
                                    onChange={handleChangeOtp}
                                    required
                                />
                            </div>
                            <button type="submit" className="butn rounded shadow font-semibold w-100">Xác Nhận OTP</button>
                            {message && <div className="mt-3 alert alert-success">{message}</div>}
                            {error && <div className="mt-3 alert alert-danger">{error}</div>}
                        </form>
                    ) : (
                        // Password Reset Form (after OTP is verified)
                        <form onSubmit={handleSubmitNewPassword} className="border rounded p-4 shadow bg-light">
                            <div className="mb-3">
                                <label htmlFor="newPassword" className="form-label text-dGreen font-semibold fs-16">Mật Khẩu Mới</label>
                                <input
                                    type="password"
                                    className="form-control border rounded"
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={handleChangeNewPassword}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="confirmPassword" className="form-label text-dGreen font-semibold fs-16">Xác Nhận Mật Khẩu</label>
                                <input
                                    type="password"
                                    className="form-control border rounded"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={handleChangeConfirmPassword}
                                    required
                                />
                            </div>
                            <button type="submit" className="butn rounded shadow font-semibold w-100">Đặt Lại Mật Khẩu</button>
                            {message && <div className="mt-3 alert alert-success">{message}</div>}
                            {error && <div className="mt-3 alert alert-danger">{error}</div>}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
