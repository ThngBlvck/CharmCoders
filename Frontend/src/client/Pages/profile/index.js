import React, {useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";

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
        const {name, value} = e.target;
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
            <div className="container-fluid py-3" style={{backgroundColor: "#fff7f8"}}>
                <div className="container text-center py-5">
                    <p className="display-3 mb-4" style={{color: "#ffa69e"}}>Hồ sơ người dùng</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{color: "#ffa69e"}}><NavLink to={`/home`}>Trang
                            chủ</NavLink></li>
                        <li className="breadcrumb-item active font-bold" style={{color: "#ffa69e"}}>Hồ sơ người dùng
                        </li>
                    </ol>
                </div>
            </div>

            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-4 text-center">
                        <div className="d-flex justify-center">
                            <img
                                src="https://via.placeholder.com/300"
                                alt="User Avatar"
                                className="img-fluid rounded-circle mb-3"
                                style={{maxHeight: '300px', objectFit: 'cover'}}
                            />
                        </div>
                        <div className="text-center">
                            <p style={{color: "#8c5e58"}} className="font-semibold">{user.name}</p>
                            <button className="btn btn-primary mt-3 font-semibold" onClick={toggleEdit} style={{color: '#442e2b'}}>
                                {isEditing ? "Hủy bỏ" : "Chỉnh sửa hồ sơ"}
                            </button>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="p-4 bg-light border rounded">
                            <p className="font-bold mb-4" style={{color: "#8c5e58", fontSize: "30px"}}>Thông tin cá
                                nhân</p>
                            <form>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Tên:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Số điện thoại:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Địa chỉ:</label>
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
                                    <button className="btn btn-primary w-100 mt-3 font-bold" type="submit" style={{color: '#442e2b', fontSize: "20px"}}>
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
