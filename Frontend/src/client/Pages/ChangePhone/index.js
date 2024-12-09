import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import "../../../assets/styles/css/style.css";
import { sendOtp, verifyOtp } from "../../../services/Phone";
import {useNavigate} from "react-router-dom";

const EditPhone = () => {
    const [phone, setPhone] = useState(""); // Lưu số điện thoại
    const [otp, setOtp] = useState(""); // Lưu mã OTP
    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Kiểm tra trạng thái xác minh số điện thoại
    const [countdown, setCountdown] = useState(0); // Thời gian đếm ngược
    const navigate = useNavigate();


    // Handle input change
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    // Handle "Gửi mã" button click
    const handleSendCode = async () => {
        try {
            // Gửi yêu cầu gửi mã OTP
            const response = await sendOtp({ phone });
            if (response?.status === 200) {
                toast.success("Mã OTP đã được gửi!", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: true,
                });
                setIsPhoneVerified(true);
                setCountdown(30); // Đếm ngược 30 giây
            } else {
                throw new Error(response?.message || "Không thể gửi mã OTP.");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.message || "Đã xảy ra lỗi khi gửi mã OTP. Vui lòng thử lại!",
                {
                    position: "top-right",
                    autoClose: 5000,
                }
            );
        }
    };

    // Verify OTP
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Gửi yêu cầu xác minh mã OTP
            const response = await verifyOtp({ phone, otp });
            if (response?.status === 200) {
                navigate("/profile")
            } else {
                throw new Error(response?.message || "Mã OTP không hợp lệ.");
            }
        } catch (error) {
            console.error(error);
            toast.error(
                error.message || "Đã xảy ra lỗi khi xác minh mã OTP. Vui lòng thử lại.",
                {
                    position: "top-right",
                    autoClose: 5000,
                }
            );
        }
    };

    // Effect để đếm ngược thời gian
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            setIsPhoneVerified(false); // Sau khi hết thời gian, bật lại nút Gửi mã
        }
        return () => clearInterval(timer); // Dọn dẹp khi component unmount
    }, [countdown]);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="p-4 bg-light border rounded shadow">
                        <p className="font-semibold mb-4 text-center text-dGreen fs-26">
                            Chỉnh sửa số điện thoại
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Trường nhập Số điện thoại */}
                            <div className="form-group mb-4">
                                <label className="font-semibold mb-2 text-dGreen fs-20">
                                    Số điện thoại:
                                </label>
                                <input
                                    type="text"
                                    className="form-control rounded fs-20"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            {/* Trường nhập OTP và nút Gửi mã */}
                            <div className="form-group mb-4">
                                <label className="font-semibold mb-2 text-dGreen fs-20">
                                    Mã OTP:
                                </label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control rounded fs-20"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="Nhập mã OTP"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="butn w-40 font-semibold ms-3 rounded"
                                        onClick={handleSendCode}
                                        disabled={isPhoneVerified || countdown > 0}
                                    >
                                        {countdown > 0
                                            ? `${countdown} giây`
                                            : "Gửi mã"}
                                    </button>
                                </div>
                            </div>

                            {/* Nút Lưu */}
                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    type="submit"
                                    className="butn w-100 font-semibold rounded shadow w-100"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Toast container để hiển thị thông báo */}
            <ToastContainer />
        </div>
    );
};

export default EditPhone;
