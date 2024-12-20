import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {getOrder, getOrderById, updateOrder} from "../../../services/Order"; // API để lấy đơn hàng
import {getUserInfo} from "../../../services/User"; // API để lấy thông tin người dùng
import {useNavigate, useParams} from "react-router-dom"; // Để lấy ID từ URL
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function OrderDetail() {
    const {id} = useParams(); // Lấy id từ URL
    const [order, setOrder] = useState(null); // Lưu thông tin đơn hàng
    const [user, setUser] = useState(null); // Lưu thông tin người dùng
    const [loading, setLoading] = useState(true); // Quản lý trạng thái loading
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const orderData = await getOrderById(id); // Gọi API với id từ URL
                console.log("Order Data: ", orderData); // Kiểm tra dữ liệu đơn hàng

                const order = {
                    id: orderData.data.id,
                    order_id: orderData.data.order_id,
                    address: orderData.data.address,
                    paymentMethod: orderData.data.payment_method,
                    phone: orderData.data.phone,
                    status: orderData.data.status,
                    total_amount: orderData.data.total_amount,
                    userId: orderData.data.user_id,
                    details: orderData.data.details,
                    payment_method: orderData.data.payment_method,
                };

                setOrder(order);

                if (orderData.data.user_id) {
                    const userData = await getUserInfo(orderData.data.user_id); // Lấy thông tin người dùng
                    console.log("User Data: ", userData);
                    setUser(userData); // Lưu thông tin người dùng vào state
                }
            } catch (error) {
                console.error("Lỗi khi tải đơn hàng:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    // Hàm để xác định màu của status
    const getStatusStyle = (status) => {
        if (status === 0) {
            return {color: "#cd8f32"}; // Màu cam
        } else if (status === 1) {
            return {color: "#328ccd"}; // Màu vàng
        } else if (status === 2) {
            return {color: "#32CD32"}; // Màu xanh lá cây
        } else if (status === 3) {
            return {color: "#32cd7d"}; // Màu cam
        } else if (status === 4) {
            return {color: "#cd3232"}; // Màu vàng
        }
        return {};
    };

    // Hàm xử lý hủy đơn hàng
    const handleCancel = async () => {
        const result = await Swal.fire({
            title: 'Thông báo',
            text: "Bạn có chắc chắn muốn hủy đơn hàng?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                // Chuyển status thành chuỗi trực tiếp
                const updatedOrder = await updateOrder(order.id, '4'); // Truyền trực tiếp giá trị chuỗi "4"
                setOrder(updatedOrder);
                console.log("Đơn hàng đã hủy");
                toast.success("Hủy đơn hàng thành công.");
                navigate('/order-list');
            } catch (error) {
                console.error("Lỗi khi hủy đơn hàng:", error);
                toast.error("Không thể hủy đơn hàng.");
            }
        }
    };

    // Hàm xử lý đã nhận hàng
    const handleReceived = async () => {
        const result = await Swal.fire({
            title: 'Thông báo',
            text: "Bạn có chắc chắn đã nhận được hàng?",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#27b701',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                // Chuyển status thành chuỗi trực tiếp
                const updatedOrder = await updateOrder(order.id, '3'); // Truyền trực tiếp giá trị chuỗi "4"
                setOrder(updatedOrder);
                console.log("Đơn hàng đã được nhận");
                toast.success("Xác nhận đơn hàng thành công.");
                navigate('/order-list');
            } catch (error) {
                console.error("Lỗi khi xác nhận đơn hàng:", error);
                toast.error("Không thể xác nhận đơn hàng.");
            }
        }
    };

    return (
        <div className="order-detail-container">
            {/* Thông tin người dùng */}
            {loading ? (
                <>
                    <div className="order-detail-container">
                        {/* Thông tin người dùng */}
                        <div className="user-info order-user">
                            {/* Skeleton cho thông tin đơn hàng */}
                            <div className="row">
                                <div className="col-6 text-dGreen">
                                    <div className="mb-3"><Skeleton width={100} height={20}/></div>
                                    {/* Mã đơn hàng */}
                                    <div className="mb-3"><Skeleton width={150}
                                                                    height={20}/> {/* Trạng thái đơn hàng */}</div>
                                </div>
                                <div className="col-6 text-dGreen">
                                    <div className="mb-3"><Skeleton width={100} height={20}/> {/* Họ tên */}</div>
                                    <div className="mb-3"><Skeleton width={100} height={20}/> {/* Số điện thoại */}
                                    </div>
                                </div>
                            </div>

                            {/* Địa chỉ giao hàng */}
                            <div className="row">
                                <div className="col-12 mb-3 text-dGreen">
                                    <Skeleton width={200} height={20}/> {/* Địa chỉ giao hàng */}
                                </div>
                            </div>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="bodyStyle">
                            <div className="product-item productRowStyle">
                                <div className="d-flex productDetailsStyle">
                                    <div className="imageContainerStyle">
                                        <Skeleton width={100} height={100}/> {/* Skeleton cho ảnh sản phẩm */}
                                    </div>
                                    <div className="product-info">
                                        <Skeleton width={150} height={20}/> {/* Skeleton cho tên sản phẩm */}
                                        <Skeleton width={100} height={20}/> {/* Skeleton cho số lượng */}
                                    </div>
                                </div>
                                <div className="product-price text-right priceStyle">
                                    <Skeleton width={100} height={20}/> {/* Skeleton cho giá sản phẩm */}
                                </div>
                            </div>

                            {/* Skeleton cho thông tin tổng tiền và phương thức thanh toán */}
                            <div className="d-flex justify-content-between font-semibold mt-3">
                                <div>
                                    <div className="mb-3">
                                        <Skeleton width={200} height={20}/> {/* Skeleton cho phương thức thanh toán */}
                                    </div>
                                    <div>
                                        <Skeleton width={150} height={20}/> {/* Skeleton cho tổng tiền */}
                                    </div>
                                </div>
                                <div>
                                    <div className="mb-3">
                                        <Skeleton width={100} height={20}/> {/* Skeleton cho số tiền */}
                                    </div>
                                    <div>
                                        <Skeleton width={100} height={20}/> {/* Skeleton cho thanh toán */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="user-info order-user">
                        {/* Thông tin đơn hàng */}
                        <div className="row">
                            <div className="col-6 text-dGreen">
                                <div className="mb-3"><span
                                    className="font-semibold mr-2">Mã đơn hàng:</span>{order?.order_id}</div>
                                <div className="mb-3"><span className="font-semibold mr-2">Trạng thái đơn hàng:</span>
                                    <span className="statusStyle font-semibold" style={getStatusStyle(order.status)}>
                                      {order.status === 0 ? 'Đang chờ xác nhận' :
                                          order.status === 1 ? 'Đang chuẩn bị hàng' :
                                              order.status === 2 ? 'Đang giao' :
                                                  order.status === 3 ? 'Đã nhận' :
                                                      order.status === 4 ? 'Đã hủy' : 'Trạng thái không xác định'}
                                </span>
                                </div>
                            </div>
                            <div className="col-6 text-dGreen">
                                <div className="mb-3">
                                    <span className="font-semibold mr-2">Họ tên:</span><span>{user?.name}</span>
                                </div>
                                <div className="mb-3">
                                    <span className="font-semibold mr-2">Số điện thoại:</span><span>{order?.phone}</span>
                                </div>
                            </div>
                        </div>

                        {/* Địa chỉ giao hàng */}
                        <div className="row">
                            <div className="col-12 mb-3 text-dGreen">
                                <i className="fa fa-location-dot text-dGreen" style={{marginRight: "8px"}}></i>
                                <span className="font-semibold mr-2">Địa chỉ giao hàng:</span>{order?.address}
                            </div>
                        </div>
                    </div>


                {/* Danh sách sản phẩm */}
                    <div className="bodyStyle">
                        {order?.details && order.details.length > 0 ? (
                            order.details.map((detail) => (
                                <div key={detail.id}
                                     className="product-item productRowStyle p-4 shadow-sm rounded mb-4">
                                    <div className="d-flex align-items-center">
                                        {/* Hình ảnh sản phẩm */}
                                        <div className="imageContainerStyle me-4">
                                            <NavLink to={`/products/${detail.product.id}`}>
                                                <img
                                                    src={detail.product.image || "https://via.placeholder.com/100"}
                                                    alt={detail.product.name}
                                                    className="imageStyle rounded border"
                                                    style={{width: "100px", height: "100px", objectFit: "cover"}}
                                                />
                                            </NavLink>
                                        </div>
                                        {/* Thông tin sản phẩm */}
                                        <div className="flex-grow-1">
                                            <NavLink to={`/products/${detail.product.id}`}
                                                     className="text-decoration-none">
                                                <div className="product-name productNameStyle text-dGreen fw-bold mb-2">
                                                    Tên sản phẩm: {detail.product.name}
                                                </div>
                                            </NavLink>
                                            <div className="product-quantity quantityStyle text-dGreen mb-2">
                                                Số lượng: x {detail.quantity}
                                            </div>
                                            <div className="product-price text-dGreen fw-semibold fs-5">
                                                Giá:{" "}
                                                {detail.price && detail.quantity && !isNaN(detail.price) && !isNaN(detail.quantity)
                                                    ? (detail.price * detail.quantity).toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })
                                                    : "N/A"}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Liên kết đi đến sản phẩm để đánh giá */}
                                    {order?.status === 3 && (
                                        <div className="text-center mt-3">
                                            <NavLink to={`/products/${detail.product.id}`}
                                                     className="btn-review font-semibold fs-14 text-dGreen px-4 py-2 rounded">
                                                Đi đến sản phẩm để đánh giá
                                            </NavLink>
                                        </div>
                                    )}
                                </div>


                            ))
                        ) : (
                            <p className="font-semibold text-center text-dGreen fs-30"
                               style={{marginTop: "30px"}}>
                                Không có sản phẩm trong đơn hàng này.
                            </p>
                        )}
                        <div className="d-flex justify-content-between font-semibold mt-3">
                            <div>
                                <div className="mb-3">
                                    <span className="text-dGreen">Phương thức thanh toán:</span> <span
                                    className="statusStyle">
                                    {order?.payment_method === 1 ? 'Thanh toán khi nhận hàng'
                                        : order?.payment_method === 2 ? 'Thanh toán chuyển khoản'
                                            : 'Không xác định'}</span>
                                </div>
                                <div>
                                    {order?.status !== 1 && order?.status !== 2 && order?.status !== 3 && order?.status !== 4 && order?.payment_method !== 2 && (
                                        <button
                                            className="btn-huy font-semibold fs-16 rounded shadow"
                                            onClick={handleCancel}
                                        >
                                            <p>Hủy đơn hàng</p>
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div>
                                <div className="mb-3">
                                    <span className="text-dGreen fs-20" style={{marginRight: "10px"}}>Tổng tiền:</span>
                                    <span className="totalAmountStyle fs-20 priceAmount">
                                {order?.total_amount ? order.total_amount.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND"
                                }) : 'N/A'}
                            </span>
                                </div>
                                <div>
                                    {order?.status !== 0 && order?.status !== 1 && order?.status !== 3 && order?.status !== 4 && (
                                        <button className="btn-nhan font-semibold fs-16 rounded shadow"
                                                onClick={handleReceived}
                                        >
                                            <p>Đã nhận hàng</p>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}