import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getUserInfo} from "../../../services/User";

export default function Edit_Profile() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading
    const queryParams = new URLSearchParams(location.search);
    // State quản lý thông tin người dùng
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload từ token:", payload); // Xem toàn bộ payload

            // Gọi fetchUserInfo để lấy thông tin người dùng
            fetchUserInfo().then(userInfo => {
                console.log("Thông tin người dùng:", userInfo); // Xem thông tin người dùng đã nhận

                if (userInfo && typeof userInfo === 'object' && userInfo.user_id) {
                    // Kiểm tra userInfo có phải là một đối tượng và có user_id
                    setUser(prevFormData => ({
                        ...prevFormData,
                        name: userInfo.name || "",
                        email: userInfo.email || "",
                        phone: userInfo.phone || "",
                        address: userInfo.address || "",
                    }));
                } else {
                    console.warn("Không có thông tin người dùng hợp lệ.");
                }
            });
        } else {
            console.error("Không tìm thấy token trong localStorage.");
        }
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await getUserInfo(); // Gọi API để lấy thông tin người dùng
            console.log("Đáp ứng từ API:", response); // Kiểm tra dữ liệu từ API

            if (response && response.user_id) {
                return response; // Trả về dữ liệu người dùng
            } else {
                console.error("Không có dữ liệu người dùng từ API.");
                return {}; // Trả về đối tượng rỗng nếu không có dữ liệu
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return {}; // Trả về đối tượng rỗng nếu có lỗi
        }
    };

    // Hàm để cập nhật thông tin người dùng
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };


    return (
        <>
            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-4 text-center">
                        <div className="d-flex flex-column align-items-center">
                            <img
                                src="https://via.placeholder.com/300"
                                alt="User Avatar"
                                className="img-fluid rounded-circle mb-3"
                                style={{maxHeight: '300px', objectFit: 'cover'}}
                            />
                            <input type="file" className="mt-2"/>
                        </div>
                        <div className="text-center">
                            <NavLink to={`/profile`}>
                                <button className="btn btn-primary mt-3 font-semibold"
                                        style={{color: '#442e2b'}}>
                                    Hủy bỏ
                                </button>
                            </NavLink>
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <div className="p-4 bg-light border rounded">
                            <p className="font-semibold mb-4 text-center"
                               style={{color: "#8c5e58", fontSize: "30px"}}>Chỉnh sửa thông tin cá
                                nhân</p>
                            <form>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Tên:</label>
                                    <input
                                        type="text"
                                        className="form-control rounded"
                                        name="name"
                                        value={user.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Email:</label>
                                    <input
                                        type="email"
                                        className="form-control rounded"
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="form-group mb-4">
                                    <label style={{color: "#8c5e58", fontSize: "20px"}}
                                           className="font-semibold mb-2">Số điện thoại:</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button className="btn btn-primary w-100 mt-3 font-semibold" type="submit"
                                        style={{color: '#442e2b', fontSize: "20px"}}>
                                    Lưu thay đổi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
