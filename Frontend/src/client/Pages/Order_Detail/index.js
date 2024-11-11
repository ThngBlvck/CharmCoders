import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {getOrderById, updateOrder} from "../../../services/Order"; // API để lấy đơn hàng
import {getUserInfo} from "../../../services/User"; // API để lấy thông tin người dùng
import {useNavigate, useParams} from "react-router-dom"; // Để lấy ID từ URL
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import {toast} from "react-toastify";

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
                    address: orderData.data.address,
                    paymentMethod: orderData.data.payment_method,
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

    if (loading) {
        return (
            <div className="d-flex flex-column align-items-center"
                 style={{marginTop: '10rem', marginBottom: '10rem'}}>
                <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
            </div>
        );
    }

    if (!order) {
        return <p>Không tìm thấy đơn hàng.</p>;
    }

    // Hàm để xác định màu của status
    const getStatusStyle = (status) => {
        if (status === 0) {
            return {color: "#ff7e6b"}; // Màu cam
        } else if (status === 1) {
            return {color: "#f8a400"}; // Màu vàng
        } else if (status === 2) {
            return {color: "#82f699"}; // Màu xanh lá cây
        } else if (status === 3) {
            return {color: "#28a745"}; // Màu cam
        } else if (status === 4) {
            return {color: "#ff0000"}; // Màu vàng
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
                Swal.fire('Thành công', 'Hủy đơn hàng thành công.', 'success').then(() => {
                    navigate('/order-history'); // Chuyển hướng sang trang order-history sau khi thông báo thành công
                });
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
                Swal.fire('Thành công', 'Nhận hàng thành công.', 'success').then(() => {
                    navigate('/order-history'); // Chuyển hướng sang trang order-history sau khi thông báo thành công
                });
            } catch (error) {
                console.error("Lỗi khi xác nhận đơn hàng:", error);
                toast.error("Không thể xác nhận đơn hàng.");
            }
        }
    };

    return (
        <div className="order-detail-container">
            {/* Thông tin người dùng */}
            {user && (
                <div className="user-info" style={{border: "1px solid #ccc", borderRadius: "8px", padding: "10px"}}>
                    {/* Thông tin đơn hàng */}
                    <div className="row">
                        <div className="col-6" style={{color: "#8c5e58"}}>
                            <div className="mb-3"><span className="font-semibold">ID đơn hàng: </span>{order.id}</div>
                            <div className="mb-3"><span className="font-semibold">Trạng thái đơn hàng: </span>
                                <span className="statusStyle" style={getStatusStyle(order.status)}>
                                  {order.status === 0 ? 'Đang chờ xác nhận' :
                                      order.status === 1 ? 'Đang chuẩn bị hàng' :
                                          order.status === 2 ? 'Đang giao' :
                                              order.status === 3 ? 'Đã nhận' :
                                                  order.status === 4 ? 'Đã hủy' : 'Trạng thái không xác định'}
                                </span>
                            </div>
                        </div>
                        <div className="col-6" style={{color: "#8c5e58"}}>
                            <div className="mb-3">
                                <span className="font-semibold">Họ tên: </span><span>{user.name}</span>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold">Số điện thoại: </span><span>{user.phone}</span>
                            </div>
                        </div>
                    </div>

                    {/* Địa chỉ giao hàng */}
                    <div className="row">
                        <div className="col-12 mb-3" style={{color: "#8c5e58"}}>
                            <i className="fa fa-location-dot" style={{marginRight: "8px", color: "#8c5e58"}}></i>
                            <span className="font-semibold">Địa chỉ giao hàng: </span>{order.address}
                        </div>
                    </div>
                </div>
            )}

            {/* Danh sách sản phẩm */}
            <div className="bodyStyle">
                {order.details && order.details.length > 0 ? (
                    order.details.map((detail) => (
                        <div key={detail.id} className="product-item productRowStyle">
                            <div className="d-flex productDetailsStyle">
                                <div className="imageContainerStyle">
                                    <NavLink to={`/products/${detail.product.id}`}>
                                        <img
                                            src={detail.product.image || "https://via.placeholder.com/100"}
                                            alt={detail.product.name}
                                            className="imageStyle"
                                        />
                                    </NavLink>
                                </div>
                                <div className="product-info">
                                    <NavLink to={`/products/${detail.product.id}`}>
                                        <div className="product-name productNameStyle">
                                            {detail.product.name}
                                        </div>
                                    </NavLink>
                                    <div className="product-quantity quantityStyle">
                                        x {detail.quantity}
                                    </div>
                                </div>
                            </div>
                            <div className="product-price text-right priceStyle">
                                {detail.price && detail.quantity && !isNaN(detail.price) && !isNaN(detail.quantity) ?
                                    (detail.price * detail.quantity).toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    }) : 'N/A'}
                            </div>

                        </div>

                    ))
                ) : (
                    <p className="font-semibold text-center"
                       style={{color: "#8c5e58", fontSize: "30px", marginTop: "30px"}}>
                        Không có sản phẩm trong đơn hàng này.
                    </p>
                )}
                <div className="d-flex justify-content-between font-semibold mt-3">
                    <div>
                        <div className="mb-3">
                            <span style={{color: "#8c5e58"}}>Phương thức thanh toán:</span> <span
                            className="statusStyle">
                                {order.payment_method === 1 ? 'Thanh toán khi nhận hàng'
                                    : order.payment_method === 2 ? 'Thanh toán chuyển khoản'
                                        : 'Không xác định'}</span>
                        </div>
                        <div>
                            {order.status !== 1 && order.status !== 2 && order.status !== 3 && order.status !== 4 && (
                                <button
                                    className="btn btn-primary font-semibold"
                                    style={{fontSize: '16px', backgroundColor: "red"}}
                                    onClick={handleCancel}
                                >
                                    <p>Hủy đơn hàng</p>
                                </button>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="mb-3">
                            <span style={{marginRight: "10px", color: "#8c5e58", fontSize: "20px"}}>Tổng tiền:</span>
                            <span className="totalAmountStyle" style={{color: "red", fontSize: "20px"}}>
                                {order.total_amount ? order.total_amount.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND"
                                }) : 'N/A'}
                            </span>
                        </div>
                        <div>
                            {order.status !== 3 && order.status !== 4 && (
                                <button className="btn btn-primary font-semibold"
                                        style={{fontSize: '16px'}}
                                        disabled={order.status === 0 || order.status === 1}
                                        onClick={handleReceived}
                                >
                                    <p>Đã nhận hàng</p>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}