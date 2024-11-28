import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useLocation, useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {deleteAccount, getUserInfo} from "../../../services/User";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import {getOrder} from "../../../services/Order";
import {deleteAddress, getAddress} from "../../../services/Address";

export default function Profile() {
    const location = useLocation();
    const [loading, setLoading] = useState(false); // Thêm state loading
    const [orders, setOrders] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const navigate = useNavigate();
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

    useEffect(() => {
        fetchAddresses(); // Gọi hàm fetchAddresses khi component được render lần đầu
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

    const fetchAddresses = async () => {
        setLoading(true); // Bắt đầu tải dữ liệu
        try {
            const result = await getAddress();
            setAddresses(result || []); // Nếu result là null thì dùng mảng rỗng
        } catch (err) {
            console.error('Error fetching addresses:', err);
            setAddresses([]); // Đảm bảo addresses không bị undefined
        } finally {
            setLoading(false); // Kết thúc tải dữ liệu
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await getOrder();  // Lấy danh sách đơn hàng
                console.log("Danh sách đơn hàng:", response);

                // Kiểm tra dữ liệu đơn hàng
                if (response.data && Array.isArray(response.data)) {
                    setOrders(response.data);  // Cập nhật state orders
                }
            } catch (error) {
                console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();  // Gọi fetchOrders khi component mount
    }, []);

    // Hàm xử lý xóa
    const handleDeleteAccount = async () => {
        // Kiểm tra nếu có đơn hàng với status là 0, 1, hoặc 2 và hiển thị thông báo tương ứng
        const pendingOrder = orders.find(order => [0, 1, 2].includes(order.status));

        if (pendingOrder) {
            if (pendingOrder.status === 0) {
                toast.warn("Vui lòng hủy đơn hàng trước khi xóa tài khoản.");
            } else if (pendingOrder.status === 1) {
                toast.warn("Đơn hàng đang được chuẩn bị. Không thể xóa tài khoản.");
            } else if (pendingOrder.status === 2) {
                toast.warn("Đơn hàng đang vận chuyển. Không thể xóa tài khoản.");
            }
            return; // Dừng việc xóa tài khoản nếu có đơn hàng đang được xử lý
        }

        const result = await Swal.fire({
            title: 'Thông báo',
            text: "Bạn có chắc chắn muốn xóa tài khoản không?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                // Gọi hàm xóa tài khoản
                await deleteAccount();
                toast.success("Xóa tài khoản thành công.");
                localStorage.removeItem('token');
                navigate(`/login`);
            } catch (error) {
                console.error("Lỗi khi xóa tài khoản:", error);
                toast.error("Không thể xóa tài khoản.");
            }
        }
    };

    const handleDeleteAddress = async (id) => {
        const result = await Swal.fire({
            title: 'Thông báo',
            text: "Bạn có chắc chắn muốn xóa địa chỉ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                // Gọi hàm xóa địa chỉ bằng id
                await deleteAddress(id);

                // Cập nhật lại danh sách địa chỉ sau khi xóa
                setAddresses(prevAddresses => prevAddresses.filter(address => address.id !== id));
                toast.success("Xóa địa chỉ thành công.");
            } catch (error) {
                console.error("Lỗi khi xóa địa chỉ:", error);
                toast.error("Không thể xóa địa chỉ.");
            }
        }
    };

    const fullAddress = ({address, ward, district, province}) => {
        // Tạo mảng chứa các thành phần không bị undefined, null hoặc chuỗi rỗng
        const parts = [address?.trim(), ward?.trim(), district?.trim(), province?.trim()].filter(Boolean);

        // Ghép các thành phần với dấu phẩy và khoảng trắng
        return parts.join(", ");
    };

    return (
        <>
            <div className="container py-5">
                <div className="row g-4 align-items-center mb-3">
                    <div className="col-lg-6 text-center">
                        <div className="d-flex justify-center">
                            {loading ? (
                                <Skeleton circle width={250} height={250}/>
                            ) : (
                                <img
                                    src={user.image || "user_default.png"}
                                    alt={user.name}
                                    className="img-fluid rounded-circle mb-3 shadow user_img"
                                />
                            )}
                        </div>
                        {!loading && (
                            <div className="text-center">
                                <p className="font-semibold text-dGreen">{user.name.length > 30 ? user.name.substring(0, 20) + "..." : user.name}</p>
                                <NavLink to={`/edit-profile`}>
                                    <button className="btn-tk w-40 mt-3 font-semibold rounded shadow">
                                        Chỉnh sửa thông tin
                                    </button>
                                </NavLink>
                            </div>
                        )}
                    </div>
                    <div className="col-lg-6">
                        <div className="p-4 bg-light border rounded shadow">
                            {loading ? (
                                <>
                                    <p className="font-semibold mb-4 text-center text-dGreen fs-30"><Skeleton
                                        height={30} width="60%"/></p>
                                    <div className="row">
                                        <div className="form-group mb-4 col-12">
                                            <Skeleton height={30} width="100%"/>
                                        </div>
                                        <div className="form-group mb-4 col-12">
                                            <Skeleton height={30} width="100%"/>
                                        </div>
                                        <div className="form-group col-12">
                                            <Skeleton height={30} width="100%"/>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <form className="row">
                                    <p className="font-semibold mb-4 text-center text-dGreen fs-26">Thông tin cá
                                        nhân</p>
                                    <div className="form-group mb-4 col-12">
                                        <label className="font-semibold mb-2 text-dGreen fs-20">
                                            <span>Họ và tên:</span>
                                        </label>
                                        <span className="text-dGreen fs-20 ml-4">{user.name}</span>

                                    </div>
                                    <div className="form-group mb-4 col-12">
                                        <label className="font-semibold mb-2 text-dGreen fs-20">
                                            <span>Email:</span>
                                        </label>
                                        <span className="text-dGreen fs-20 ml-4">{user.email}</span>
                                    </div>
                                    <div className="form-group col-12">
                                        <label className="font-semibold mb-2 text-dGreen fs-20">
                                            <span>Số điện thoại:</span>
                                        </label>
                                        <NavLink to={`/edit_phone`}>
                                            <button className="btn-edit-phone">
                                                <i className="fas fa-pencil-alt"></i> {/* Edit icon */}
                                            </button>
                                        </NavLink>
                                        <span className="text-dGreen fs-20 ml-4">{user.phone}</span>
                                    </div>
                                </form>
                            )}
                        </div>
                        {!loading && (
                            <div>
                                <NavLink to={`/change_password`}>
                                    <button className="btn-tk mt-3 mx-2 font-semibold rounded btn-20 shadow">
                                        Đổi mật khẩu
                                    </button>
                                </NavLink>
                                <button className="btn-huy mt-3 mx-2 font-semibold rounded btn-20 shadow"
                                        onClick={() => handleDeleteAccount()}>
                                    Xóa tài khoản
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="shadow rounded mt-4">
                    {loading ? (
                        <>
                            <ul className="list-group">
                                {Array.from({length: 2}).map((_, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-center text-dGreen"
                                    >
                                        <Skeleton width="60%" height="20px"/>
                                        <div className="d-flex justify-content-evenly">
                                            <Skeleton circle={true} width={40} height={40}/>
                                            <Skeleton
                                                circle={true}
                                                width={40}
                                                height={40}
                                                style={{marginLeft: "10px"}}
                                            />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <ul className="list-group bg-light">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <p className="font-semibold flex-grow-1 ml-4 mt-3 text-dGreen fs-20">
                                    Địa chỉ
                                </p>
                                <NavLink to={`/add-address`} className="butn w-40 py-3 px-3 mr-4 mt-3 rounded font-semibold shadow">

                                        Thêm địa chỉ

                                </NavLink>
                            </div>
                            {addresses.length > 0 ? (
                                addresses.map((address) => (
                                    <li
                                        key={address.id}
                                        className="list-group-item d-flex justify-content-between align-items-center text-dGreen bg-light"
                                    >
                                        {fullAddress(address)}
                                        <div className="d-flex justify-content-evenly">
                                            <NavLink to={`/edit-address/${address.id}`}>
                                                <button className="btn-tk btn-address rounded font-semibold shadow">
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                            </NavLink>
                                            <button className="btn-huy btn-address rounded font-semibold shadow"
                                                    style={{marginLeft: '10px'}}
                                                    onClick={() => handleDeleteAddress(address.id)}>
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))
                            ) : (
                                <p className="text-dGreen fs-20 text-center mt-3 mb-3">
                                    Chưa có địa chỉ. Vui lòng thêm địa chỉ của bạn.
                                </p>
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}
