import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getOrderAdmin } from '../../../../services/Order';  // Assuming you have a similar service for fetching orders

export default function Order({ color }) {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const result = await getOrderAdmin();
            setOrders(result || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    // Function to format the money to VND
    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    // Navigate to the order edit page
    const handleEditOrder = (orderId) => {
        navigate(`/admin/order/edit/${orderId}`);
    };

    return (
        <>
            <div
                className={
                    "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                    (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
                }
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3
                                className={
                                    "font-semibold text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                            >
                                Đơn hàng
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Orders table */}
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "10%" }}
                            >
                                STT
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "20%" }}
                            >
                                Tên người dùng
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "20%" }}
                            >
                                Thành Tiền
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "10%" }}
                            >
                                Trạng Thái
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "10%" }}
                            >
                                Hành động
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order.id}>
                                    <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                            <span
                                                className={
                                                    "ml-3 font-bold " +
                                                    (color === "light" ? "text-blueGray-600" : "text-white")
                                                }
                                            >
                                                {index + 1}
                                            </span>
                                    </th>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {order.user_name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {formatVND(order.total_amount)} {/* Formatted in VND */}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {(() => {
                                            switch (order.status) {
                                                case 0:
                                                    return "Đang chờ xác nhận";
                                                case 1:
                                                    return "Đang chuẩn bị hàng";
                                                case 2:
                                                    return "Đang giao";
                                                case 3:
                                                    return "Đã nhận hàng";
                                                case 4:
                                                    return "Đã hủy";
                                                default:
                                                    return "Không xác định";
                                            }
                                        })()}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 px-2"
                                            onClick={() => handleEditOrder(order.id)} // Trigger navigation to edit page
                                        >
                                            <i className="fas fa-pen text-xl"></i>
                                        </button>
                                        <button className="text-blue-500 hover:text-blue-700 ml-2 px-2">
                                            <i className="fas fa-eye text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

Order.defaultProps = {
    color: "light",
};

Order.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
