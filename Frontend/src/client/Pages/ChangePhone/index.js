import React, { useState, useEffect } from "react";
import "../../../assets/styles/css/style.css";
import { sendOtp, verifyOtp } from "../../../services/Phone";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPhone = () => {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
        setErrors((prev) => ({ ...prev, phone: null }));
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
        setErrors((prev) => ({ ...prev, otp: null }));
    };

    const handleSendCode = async () => {
        try {
            setErrors({});
            const response = await sendOtp({ phone });
            setIsPhoneVerified(true);
            const currentTime = new Date().getTime();
            const endTime = currentTime + 30 * 1000; // Thêm 30 giây
            localStorage.setItem('otpEndTime', endTime); // Lưu thời gian hết hạn
            setCountdown(30);
            toast.success("Gửi mã thành công!");
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: "Đã xảy ra lỗi, vui lòng thử lại!" });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setErrors({});
            const response = await verifyOtp({ phone, otp });
            navigate("/profile");
        } catch (error) {
            if (error.errors) {
                setErrors(error.errors);
            } else {
                setErrors({ general: "Đã xảy ra lỗi, vui lòng thử lại!" });
            }
        }
    };

    useEffect(() => {
        const storedEndTime = localStorage.getItem('otpEndTime');
        const currentTime = new Date().getTime();
    
        if (storedEndTime) {
            const remainingTime = Math.max(0, Math.floor((storedEndTime - currentTime) / 1000)); // Lấy giá trị giây và làm tròn xuống
            setCountdown(remainingTime);
        }
    
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else {
            setIsPhoneVerified(false);
            localStorage.removeItem('otpEndTime'); // Xóa thời gian hết hạn khi hết countdown
        }
    
        return () => clearInterval(timer);
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
                            {errors.general && (
                                <div className="alert alert-danger" role="alert">
                                    {errors.general}
                                </div>
                            )}

                            <div className="form-group mb-4">
                                <label className="font-semibold mb-2 text-dGreen fs-20">
                                    Số điện thoại:
                                </label>
                                <input
                                    type="text"
                                    className={`form-control rounded fs-20 ${
                                        errors.phone ? "is-invalid" : ""
                                    }`}
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="Nhập số điện thoại"
                                />
                                {errors.phone && (
                                    <small className="text-danger">
                                        {errors.phone[0]}
                                    </small>
                                )}
                            </div>

                            <div className="form-group mb-4">
                                <label className="font-semibold mb-2 text-dGreen fs-20">
                                    Mã OTP:
                                </label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className={`form-control rounded fs-20 ${
                                            errors.otp ? "is-invalid" : ""
                                        }`}
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="Nhập mã OTP"
                                    />
                                    <button
                                        type="button"
                                        className="butn w-40 font-semibold ms-3 rounded"
                                        onClick={handleSendCode}
                                        disabled={isPhoneVerified || countdown > 0}
                                    >
                                        {countdown > 0 ? `${countdown} giây` : "Gửi mã"}
                                    </button>
                                </div>
                                {errors.otp && (
                                    <small className="text-danger">
                                        {errors.otp[0]}
                                    </small>
                                )}
                            </div>

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
        </div>
    );
};

export default EditPhone;
