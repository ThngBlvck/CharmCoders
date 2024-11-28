import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify"; // Import react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import CSS của react-toastify
import "../../../assets/styles/css/style.css";


const EditPhone = () => {
    const [phone, setPhone] = useState(""); // Lưu số điện thoại
    const [otp, setOtp] = useState(""); // Lưu mã OTP
    const [isPhoneVerified, setIsPhoneVerified] = useState(false); // Kiểm tra trạng thái xác minh số điện thoại
    const [countdown, setCountdown] = useState(0); // Thời gian đếm ngược

    // Handle input change
    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    };

    // Handle "Gửi mã" button click
    const handleSendCode = () => {
        // Giả sử bạn sẽ gọi API để gửi mã xác minh ở đây
        // Hiển thị thông báo khi gửi mã thành công
        toast.success("Mã OTP đã được gửi!", {
            position: "top-right", // Vị trí thông báo
            autoClose: 5000, // Tự động đóng sau 5 giây
            hideProgressBar: true, // Không hiển thị thanh tiến trình
            closeOnClick: true, // Cho phép đóng khi click
            pauseOnHover: true, // Tạm dừng khi hover
            draggable: true, // Cho phép kéo thả
            progress: undefined, // Tắt thanh tiến trình
        });

        setIsPhoneVerified(true); // Sau khi gửi mã, có thể cập nhật trạng thái xác minh

        // Bắt đầu đếm ngược 30 giây
        setCountdown(30);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logic để lưu thông tin khi form được submit
        toast.success("Thông tin đã được lưu!", {
            position: "top-right", // Vị trí thông báo
            autoClose: 5000, // Tự động đóng sau 5 giây
            hideProgressBar: true, // Không hiển thị thanh tiến trình
            closeOnClick: true, // Cho phép đóng khi click
            pauseOnHover: true, // Tạm dừng khi hover
            draggable: true, // Cho phép kéo thả
            progress: undefined, // Tắt thanh tiến trình
        });
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="p-4 bg-light border rounded shadow">
                        <h3 className="font-semibold mb-4 text-center text-success fs-30">
                            Chỉnh sửa số điện thoại
                        </h3>

                        <form onSubmit={handleSubmit}>
                            {/* Trường nhập Số điện thoại */}
                            <div className="form-group mb-4">
                                <label className="font-semibold mb-2 text-success fs-20">
                                    Số điện thoại:
                                </label>
                                <input
                                    type="text"
                                    className="form-control fs-20"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="Nhập số điện thoại"
                                    required
                                />
                            </div>

                            {/* Trường nhập OTP và nút Gửi mã */}
                            <div className="form-group mb-4">
                                <label className="font-semibold mb-2 text-success fs-20">
                                    Mã OTP:
                                </label>
                                <div className="d-flex">
                                    <input
                                        type="text"
                                        className="form-control fs-20"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        placeholder="Nhập mã OTP"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="btn butn-border btn-tkp text-dGreen font-semibold ms-3 rounded"
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
                                    className="btn utn-border btn-tkp text-dGreen font-semibold rounded shadow w-100"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            {/* Toast container để hiển thị thông báo */}
            <ToastContainer/>
        </div>
    );
};

export default EditPhone;
