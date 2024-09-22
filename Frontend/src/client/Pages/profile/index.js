import React, { useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";

export default function Profile() {
    // State quản lý thông tin người dùng
    const [user, setUser] = useState({
        name: "Nguyen Van A",
        email: "nguyenvana@gmail.com",
        phone: "0123456789",
        address: "Số 22, Thường Thạnh, Cái Răng, Cần Thơ",
    });

    // State để quản lý trạng thái chỉnh sửa
    const [isEditing, setIsEditing] = useState(false);

    // Hàm để cập nhật thông tin người dùng
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    // Hàm để chuyển đổi trạng thái chỉnh sửa
    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return (
        <>
            <div className="container-fluid bg-breadcrumb py-5">
                <div className="container text-center py-5">
                    <h1 className="text-white display-3 mb-4">Hồ sơ người dùng</h1>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item"><a href="#">Trang chủ</a></li>
                        <li className="breadcrumb-item active text-white">Hồ sơ</li>
                    </ol>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-4 text-center">
                        <img
                            src="https://iparty.vn/wp-content/uploads/2022/08/anh-profile-150x150.jpg"
                            alt="User Avatar"
                            className="img-fluid rounded-circle mb-3"
                        />
                        <h3>{user.name}</h3>
                        <button className="btn btn-primary mt-3" onClick={toggleEdit}>
                            {isEditing ? "Hủy bỏ" : "Chỉnh sửa hồ sơ"}
                        </button>
                    </div>
                    <div className="col-lg-8">
                        <div className="p-4 bg-light border rounded">
                            <h4 className="mb-4">Thông tin cá nhân</h4>
                            <form>
                                <div className="form-group mb-3">
                                    <label>Tên:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Số điện thoại:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label>Địa chỉ:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="address"
                                        value={user.address}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                {isEditing && (
                                    <button className="btn btn-success w-100 mt-3" type="submit">
                                        Lưu thay đổi
                                    </button>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
