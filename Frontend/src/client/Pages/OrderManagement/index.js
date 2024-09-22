import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css";

const initialOrders = [
    { id: 1, product: "Sản phẩm A", status: "Đang chờ", total: 150000, details: "Chi tiết sản phẩm A" },
    { id: 2, product: "Sản phẩm B", status: "Đã giao", total: 200000, details: "Chi tiết sản phẩm B" },
];

export default function OrderManagement() {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleCancel = (id) => {
        const updatedOrders = orders.filter(order => order.id !== id);
        setOrders(updatedOrders);
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    const closeDetails = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Quản Lý Đơn Hàng</h2>
            {orders.length === 0 ? (
                <p className="text-center">Bạn chưa có đơn hàng nào.</p>
            ) : (
                <table className="table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sản phẩm</th>
                        <th>Trạng thái</th>
                        <th>Tổng tiền</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.product}</td>
                            <td>{order.status}</td>
                            <td>{order.total.toLocaleString("vi-VN")} VND</td>
                            <td>
                                <button className=" me-2 " onClick={() => handleViewDetails(order)}>
                                    <i className="fas fa-eye"></i>
                                </button>
                                {order.status === "Đang chờ" && (
                                    <button
                                        className="mx-2"
                                        onClick={() => handleCancel(order.id)}
                                    >
                                        <i className="fas fa-trash"></i>

                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {selectedOrder && (
                <div className="modal show" style={{ display: 'block' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi Tiết Đơn Hàng</h5>
                                <button type="button" className="btn-close" onClick={closeDetails}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>ID:</strong> {selectedOrder.id}</p>
                                <p><strong>Sản phẩm:</strong> {selectedOrder.product}</p>
                                <p><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                                <p><strong>Tổng tiền:</strong> {selectedOrder.total.toLocaleString("vi-VN")} VND</p>
                                <p><strong>Chi tiết:</strong> {selectedOrder.details}</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeDetails}>Đóng</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
