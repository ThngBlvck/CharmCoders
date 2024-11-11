import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getUserInfo} from "../../../services/User";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";

export default function Profile() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading
    const queryParams = new URLSearchParams(location.search);
    // State quản lý thông tin người dùng
    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        image: "",
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload từ token:", payload); // Xem toàn bộ payload

            // Đặt loading về true khi bắt đầu tải dữ liệu
            setLoading(true);

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
                        image: userInfo.image || "",
                    }));
                } else {
                    console.warn("Không có thông tin người dùng hợp lệ.");
                }
            }).finally(() => {
                setLoading(false); // Tắt loading khi API trả về
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

    return (
        <>
            <div className="container py-5">
                {/* Hiển thị loading khi đang tải */}
                {loading ? (
                    <div className="d-flex flex-column align-items-center"
                         style={{marginTop: '10rem', marginBottom: '10rem'}}>
                        <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                        <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                    </div>
                ) : (
                    <div className="row g-4 align-items-center">
                        <div className="col-lg-4 text-center">
                            <div className="d-flex justify-center">
                                <img
                                    src={user.image}
                                    alt="User Avatar"
                                    className="img-fluid rounded-circle mb-3"
                                    style={{
                                        width: '250px',
                                        height: '250px',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                />
                            </div>
                            <div className="text-center">
                                <p style={{color: "#8c5e58"}} className="font-semibold">{user.name.length > 30 ? user.name.substring(0, 20) + "..." : user.name}</p>
                                <NavLink to={`/edit-profile`}>
                                    <button className="btn btn-primary mt-3 font-semibold" style={{color: '#442e2b'}}>
                                        Chỉnh sửa thông tin
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="p-4 bg-light border rounded">
                                <p className="font-semibold mb-4 text-center"
                                   style={{color: "#8c5e58", fontSize: "30px"}}>Thông tin cá
                                    nhân</p>
                                <form className="row">
                                    <div className="form-group mb-4 col-6">
                                        <label style={{color: "#8c5e58", fontSize: "20px"}}
                                               className="font-semibold mb-2">Họ và Tên: <span
                                            style={{color: "#bd8782", fontSize: "20px"}}>{user.name}</span></label>

                                    </div>
                                    <div className="form-group mb-4 col-6">
                                        <label style={{color: "#8c5e58", fontSize: "20px"}}
                                               className="font-semibold mb-2">Email: <span
                                            style={{color: "#bd8782", fontSize: "20px"}}>{user.email}</span></label>
                                    </div>
                                    <div className="form-group col-6">
                                        <label style={{color: "#8c5e58", fontSize: "20px"}}
                                               className="font-semibold mb-2">Số điện thoại: <span
                                            style={{color: "#bd8782", fontSize: "20px"}}>{user.phone}</span></label>
                                    </div>
                                </form>
                            </div>
                            <div>
                                <NavLink to={`/change-password`}>
                                    <button className="btn btn-primary mt-3 mx-2 font-semibold"
                                            style={{color: '#442e2b'}}>
                                        Đổi mật khẩu
                                    </button>
                                </NavLink>
                                <button className="btn btn-primary mt-3 mx-2 font-semibold bg-danger"
                                        style={{color: '#fff'}}>
                                    Xóa tài khoản
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
