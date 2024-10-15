import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần
import "../../../assets/styles/css/style.css"; // Nếu có các kiểu riêng

export default function ResetPassword() {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleChangeNewPassword = (e) => {
        setNewPassword(e.target.value);
    };

    const handleChangeConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPassword === confirmPassword) {
            console.log("Mật khẩu mới:", newPassword);
            setMessage("Mật khẩu đã được đặt lại thành công.");
            setNewPassword("");
            setConfirmPassword("");
        } else {
            setMessage("Mật khẩu xác nhận không khớp.");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Đặt Lại Mật Khẩu</h2>
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <div className="mb-3">
                            <label htmlFor="newPassword" className="form-label">Mật Khẩu Mới</label>
                            <input
                                type="password"
                                className="form-control border"
                                id="newPassword"
                                value={newPassword}
                                onChange={handleChangeNewPassword}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="confirmPassword" className="form-label">Xác Nhận Mật Khẩu</label>
                            <input
                                type="password"
                                className="form-control border"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={handleChangeConfirmPassword}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Đặt Lại Mật Khẩu</button>
                        {message && <div className="mt-3 alert alert-success">{message}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}
