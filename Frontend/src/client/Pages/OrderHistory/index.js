import React from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink} from "react-router-dom";

export default function OrderHistory() {
    const orders = [
        {
            id: 1,
            products: [
                { name: "Sản phẩm 1", quantity: 1, price: 100000 },
                { name: "Sản phẩm A", quantity: 1, price: 200000 },
                { name: "Sản phẩm B", quantity: 1, price: 300000 },
                { name: "Sản phẩm C", quantity: 1, price: 400000 },
            ],
            total: 1000000,
            status: "Đã giao",
            paymentMethod: "Thanh toán chuyển khoản"
        },
        {
            id: 2,
            products: [
                { name: "Sản phẩm A", quantity: 1, price: 600000 },
                { name: "Sản phẩm B", quantity: 1, price: 400000 },
            ],
            total: 1000000,
            status: "Đã giao",
            paymentMethod: "Thanh toán khi nhận hàng"
        },
        {
            id: 3,
            products: [
                { name: "Sản phẩm Aaa", quantity: 1, price: 600000 },
                { name: "Sản phẩm Bbb", quantity: 1, price: 400000 },
                { name: "Sản phẩm Ccc", quantity: 1, price: 400000 },
            ],
            total: 1400000,
            status: "Đã hủy",
            paymentMethod: "Thanh toán khi nhận hàng"
        },
        {
            id: 4,
            products: [
                { name: "Sản phẩm Aaa", quantity: 1, price: 600000 },
            ],
            total: 600000,
            status: "Đã hủy",
            paymentMethod: "Thanh toán chuyển khoản"
        },
    ];

    // Hàm để xác định màu của status
    const getStatusStyle = (status) => {
        if (status === "Đã giao") {
            return { color: "#28a745" };
        } else if (status === "Đã hủy") {
            return { color: "#ff0000" };
        }
        return {};
    };

    return (
        <div className="container mt-5">
            <p className="headingStyle font-semibold">Lịch sử đơn hàng</p>
            {orders.map((order) => (
                <div key={order.id} className="order-history-card mb-4 cardStyle">
                    <div className="headerStyle">
                        <div className="headerRowStyle">
                            <strong>ID đơn hàng: {order.id}</strong>
                            <strong>Trạng thái: <span className="statusStyle" style={getStatusStyle(order.status)}>{order.status}</span></strong>
                        </div>
                    </div>
                    <div className="bodyStyle">
                    {order.products.map((product, index) => (
                            <div key={index} className="product-item productRowStyle">
                                <div className="d-flex productDetailsStyle">
                                    <div className="imageContainerStyle">
                                        <NavLink to={`/products/:id`}>
                                            <img
                                                src="https://via.placeholder.com/100"
                                                alt={product.name}
                                                className="imageStyle"
                                            />
                                        </NavLink>
                                    </div>
                                    <div className="product-info">
                                        <NavLink to={`/products/:id`}>
                                            <div className="product-name productNameStyle">
                                                {product.name}
                                            </div>
                                        </NavLink>

                                        <div className="product-quantity quantityStyle">
                                        x {product.quantity}
                                        </div>
                                    </div>
                                </div>
                                <div className="product-price text-right priceStyle">
                                    {product.price.toLocaleString("vi-VN", {
                                        style: "currency",
                                        currency: "VND",
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="footerStyle d-flex justify-content-between font-semibold">
                        <span>Phương thức thanh toán: <span
                            className="statusStyle">{order.paymentMethod}</span></span>
                        <div>
                            <span style={{marginRight: "10px"}}>Tổng tiền:</span>
                            <span className="totalAmountStyle">{order.total.toLocaleString()} VND</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}