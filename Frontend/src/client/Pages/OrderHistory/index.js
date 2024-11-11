import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";
import {getOrder} from "../../../services/Order";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons"; // Giả sử bạn đã có API này

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [showAllProducts, setShowAllProducts] = useState({});
    const [loading, setLoading] = useState(false);

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

    // Hàm để xác định màu của status
    const getStatusStyle = (status) => {
        if (status === 3) {
            return {color: "#28a745"}; // Màu cam
        } else if (status === 4) {
            return {color: "#ff0000"}; // Màu vàng
        }
        return {};
    };

    const toggleShowAll = (orderId) => {
        setShowAllProducts((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    return (
        <div className="container mt-5">
            <p className="headingStyle font-semibold">Lịch sử đơn hàng</p>
            {loading ? (
                <div className="d-flex flex-column align-items-center"
                     style={{marginTop: '10rem', marginBottom: '10rem'}}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                    <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                </div>
            ) : (
                <>
                    {orders.length > 0 ? (
                        // Lọc đơn hàng có status là 3 hoặc 4
                        orders.filter(order => [3, 4].includes(order.status)).length > 0 ? (
                            orders.filter(order => [3, 4].includes(order.status)).map((order) => (

                                <div key={order.id} className="order-history-card mb-4 cardStyle">
                                    <div className="headerStyle">
                                        <div className="headerRowStyle">
                                            <strong>ID đơn hàng: {order.id}</strong>
                                            <strong>Trạng thái đơn hàng: <span className="statusStyle"
                                                                               style={getStatusStyle(order.status)}>
                                        {order.status === 3 ? 'Đã nhận'
                                            : order.status === 4 ? 'Đã hủy'
                                                : 'Không xác định'}
                                        </span>
                                            </strong>
                                        </div>
                                    </div>
                                    <div className="bodyStyle">
                                        {order.details && order.details.length > 0 ? (
                                            <>
                                                {order.details
                                                    .slice(0, showAllProducts[order.id] ? order.details.length : 2)
                                                    .map((detail) => (
                                                        <div key={detail.product.id}
                                                             className="product-item productRowStyle">
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
                                                                        <div
                                                                            className="product-name productNameStyle">
                                                                            {detail.product.name}
                                                                        </div>
                                                                    </NavLink>
                                                                    <div className="product-quantity quantityStyle">
                                                                        x {detail.quantity}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="product-price text-right priceStyle">
                                                                {(detail.price * detail.quantity).toLocaleString("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                })}
                                                            </div>
                                                        </div>
                                                    ))}
                                                {order.details.length > 2 && (
                                                    <div className="toggle-view text-center mt-2">
                                                        <button onClick={() => toggleShowAll(order.id)}
                                                                className="btn btn-link"
                                                                style={{color: "red", fontSize: "16px"}}>
                                                            {showAllProducts[order.id] ? "Thu gọn" : "Xem thêm"}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <p className="font-semibold text-center"
                                               style={{color: "#8c5e58", fontSize: "30px", marginTop: "30px"}}>Không
                                                có
                                                sản phẩm
                                                trong đơn hàng này.</p>
                                        )}
                                    </div>
                                    <div className="footerStyle font-semibold row">
                                        {/* Cột 1 */}
                                        <div className="col-4">
                                            <span className="statusStyle">
                                                {order.payment_method === 1 ? 'Thanh toán khi nhận hàng'
                                                    : order.payment_method === 2 ? 'Thanh toán chuyển khoản'
                                                        : 'Không xác định'}</span>
                                        </div>

                                        {/* Cột 2 */}
                                        <div className="col-4 text-center">
                                            <NavLink to={`/order/${order.id}`}>
                                                <button className="btn btn-primary font-semibold"
                                                        style={{fontSize: '16px'}}>
                                                    <p>Xem chi tiết</p>
                                                </button>
                                            </NavLink>
                                        </div>

                                        {/* Cột 3 */}
                                        <div className="col-4 text-right">
                                            <span style={{marginRight: "10px"}}>Tổng tiền:</span>
                                            <span className="totalAmountStyle">
                                                {order.total_amount.toLocaleString("vi-VN", {
                                                    style: "currency", currency: "VND",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                            ))
                        ) : (
                            <p className="text-center"
                               style={{
                                   color: "#8c5e58",
                                   fontSize: "20px",
                                   marginTop: "30px",
                                   marginBottom: "30px"
                               }}>Chưa có đơn hàng nào.</p>
                        )
                    ) : (
                        <p className="text-center"
                           style={{color: "#8c5e58", fontSize: "20px", marginTop: "30px", marginBottom: "30px"}}>Không
                            có đơn hàng nào.</p>
                    )}
                </>
            )}
        </div>
    );
}