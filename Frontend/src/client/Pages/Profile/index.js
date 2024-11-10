import React, { useEffect, useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getUserInfo } from "../../../services/User";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const location = useLocation();
    const [loading, setLoading] = useState(true); // Start loading as true
    const queryParams = new URLSearchParams(location.search);
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
            console.log("Payload từ token:", payload);

            fetchUserInfo().then(userInfo => {
                console.log("Thông tin người dùng:", userInfo);

                if (userInfo && typeof userInfo === 'object' && userInfo.user_id) {
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
                setLoading(false); // Stop loading once the user info is fetched
            });
        } else {
            console.error("Không tìm thấy token trong localStorage.");
            setLoading(false); // Stop loading if there's no token
        }
    }, []);

    const fetchUserInfo = async () => {
        try {
            const response = await getUserInfo();
            console.log("Đáp ứng từ API:", response);

            if (response && response.user_id) {
                return response;
            } else {
                console.error("Không có dữ liệu người dùng từ API.");
                return {};
            }
        } catch (error) {
            console.error("Lỗi khi lấy thông tin người dùng:", error);
            return {};
        }
    };

    return (
        <div className="container py-5">
            <div className="row g-4 align-items-center">
                <div className="col-lg-4 text-center">
                    <div className="d-flex justify-center">
                        <img
                            src="https://via.placeholder.com/300"
                            alt="User Avatar"
                            className="img-fluid rounded-circle mb-3"
                            style={{ maxHeight: '300px', objectFit: 'cover' }}
                        />
                    </div>
                    <div className="text-center">
                        <p style={{ color: "#8c5e58" }} className="font-semibold">{user.name}</p>
                        <div className="d-flex justify-content-center gap-3 mt-3">
                            <NavLink to={`/edit-profile`}>
                                <button className="btn btn-primary font-semibold px-4">
                                    Chỉnh sửa hồ sơ
                                </button>
                            </NavLink>
                            <NavLink to={`/change_password`}>
                                <button className="btn btn-primary font-semibold px-4">
                                    Đổi mật khẩu
                                </button>
                            </NavLink>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="p-4 bg-light border rounded">
                        {loading ? (
                            <div className="text-center">
                                <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                                <p>Đang tải thông tin người dùng...</p>
                            </div>
                        ) : (
                            <>
                                <p className="font-semibold mb-4 text-center" style={{ color: "#8c5e58", fontSize: "30px" }}>Thông tin cá nhân</p>
                                <form>
                                    <div className="form-group mb-4">
                                        <label style={{ color: "#8c5e58", fontSize: "20px" }}
                                               className="font-semibold mb-2">Tên: <span style={{ color: "#bd8782", fontSize: "20px" }}>{user.name}</span></label>
                                    </div>
                                    <div className="form-group mb-4">
                                        <label style={{ color: "#8c5e58", fontSize: "20px" }}
                                               className="font-semibold mb-2">Email: <span style={{ color: "#bd8782", fontSize: "20px" }}>{user.email}</span></label>
                                    </div>
                                    <div className="form-group mb-4">
                                        <label style={{ color: "#8c5e58", fontSize: "20px" }}
                                               className="font-semibold mb-2">Số điện thoại: <span style={{ color: "#bd8782", fontSize: "20px" }}>{user.phone}</span></label>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
