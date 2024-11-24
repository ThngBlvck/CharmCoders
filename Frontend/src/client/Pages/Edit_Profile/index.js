import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getUserInfo, changeProfile} from "../../../services/User";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Edit_Profile() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading
    const queryParams = new URLSearchParams(location.search);
    const [selectedImage, setSelectedImage] = useState(null); // Thêm state cho ảnh đã chọn
    const navigate = useNavigate();

    // State quản lý thông tin người dùng
    const [user, setUser] = useState({
        name: "",
        image: "",
    });

    // State quản lý lỗi
    const [errors, setErrors] = useState({
        name: "",
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log("Payload từ token:", payload); // Xem toàn bộ payload

            setLoading(true); // Đảm bảo loading được bật khi gọi API

            // Gọi fetchUserInfo để lấy thông tin người dùng
            fetchUserInfo().then(userInfo => {
                console.log("Thông tin người dùng:", userInfo); // Xem thông tin người dùng đã nhận

                if (userInfo && typeof userInfo === 'object' && userInfo.user_id) {
                    // Kiểm tra userInfo có phải là một đối tượng và có user_id
                    setUser(prevFormData => ({
                        ...prevFormData,
                        name: userInfo.name || "",
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
            const response = await getUserInfo(); // Không cần truyền userId
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

    // Hàm để cập nhật thông tin người dùng
    const handleChange = (e) => {
        const {name, value} = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value, // Cập nhật đúng trường tương ứng
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];

        if (file && allowedTypes.includes(file.type)) {
            const imageURL = URL.createObjectURL(file); // Tạo URL tạm thời cho ảnh
            setSelectedImage(imageURL); // Lưu URL tạm thời để hiển thị
            setUser((prevUser) => ({
                ...prevUser,
                image: file, // Lưu file gốc để gửi đi trong FormData
            }));
        } else {
            alert("Vui lòng chọn file ảnh có định dạng jpeg, png, jpg hoặc gif.");
            // Reset ảnh nếu file không hợp lệ
            setSelectedImage(null);
            setUser((prevUser) => ({
                ...prevUser,
                image: "", // Đặt lại image nếu file không hợp lệ
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let formErrors = {}; // Dùng object này để lưu lỗi
        if (!user.name.trim()) {
            formErrors.name = "Họ và tên không được để trống.";
        }

        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors); // Nếu có lỗi, set errors vào state
            setLoading(false);
            return; // Dừng submit form nếu có lỗi
        }

        const formData = new FormData();
        formData.append('name', user.name);

        // Kiểm tra xem có ảnh mới thay đổi không
        if (user.image && user.image instanceof File) {
            // Kiểm tra nếu là tệp hợp lệ
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif"];
            if (allowedTypes.includes(user.image.type)) {
                formData.append('image', user.image);
            } else {
                setLoading(false);
                alert("Vui lòng chọn ảnh có định dạng hợp lệ.");
                return;
            }
        }

        // Kiểm tra dữ liệu FormData
        for (let pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        try {
            await changeProfile(formData); // Gửi request lên server
            toast.success("Cập nhật thông tin thành công.");
            navigate('/profile');
        } catch (error) {
            console.error("Lỗi khi cập nhật thông tin:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-4 text-center">
                        <div className="d-flex flex-column align-items-center position-relative">
                            {loading ? (
                                <Skeleton circle width={250} height={250}/>
                            ) : (
                                <img
                                    src={selectedImage || user.image || "https://via.placeholder.com/300"}
                                    alt="User Avatar"
                                    className="img-fluid rounded-circle mb-3 shadow"
                                    style={{
                                        width: '250px',
                                        height: '250px',
                                        objectFit: 'cover',
                                        objectPosition: 'center',
                                    }}
                                />
                            )}
                            {!loading && (
                                <>
                                    <label htmlFor="file-upload"
                                           className="position-absolute bottom-0 start-50 translate-middle-x mb-3"
                                           style={{cursor: 'pointer'}}>
                                        <i className="fa-solid fa-camera fs-30 ic"></i>
                                    </label>
                                    <input
                                        id="file-upload"
                                        type="file"
                                        className="d-none"
                                        accept="image/jpeg, image/png, image/jpg, image/gif" // Chỉ nhận ảnh
                                        onChange={handleImageChange}
                                    />
                                </>
                            )}
                        </div>
                        {!loading && (
                            <div className="text-center">
                                <NavLink to={`/profile`}>
                                    <button className="btn-tk mt-3 font-semibold rounded shadow">
                                        Hủy bỏ
                                    </button>
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <div className="col-lg-8">
                        <div className="p-4 bg-light border rounded shadow">
                            <p className="font-semibold mb-4 text-center text-dGreen fs-30">
                                {loading ? <Skeleton width={300} height={30}/> : "Chỉnh sửa thông tin cá nhân"}
                            </p>
                            {loading ? (
                                <>
                                    <Skeleton width="20%" height={40} className="mb-3"/>
                                    <Skeleton width="100%" height={40} className="mb-3"/>
                                    <div className="d-flex justify-center">
                                        <Skeleton width={150} height={40} className="text-center"/>
                                    </div>
                                </>
                            ) : (
                                <form>
                                    <div className="form-group mb-2">
                                        <label className="font-semibold mb-2 text-dGreen fs-30">Họ và tên:</label>
                                        <input
                                            type="text"
                                            className="form-control rounded"
                                            name="name"
                                            value={user.name}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <div className="text-danger mt-2">{errors.name}</div>}
                                    </div>
                                    <div className="text-center">
                                        <button className="btn-tk btn-20 mt-3 font-semibold fs-20 rounded shadow"
                                                type="submit"
                                                onClick={handleSubmit} disabled={loading}>
                                            {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
