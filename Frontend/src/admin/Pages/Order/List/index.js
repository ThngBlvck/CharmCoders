import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getOrderAdmin } from '../../../../services/Order';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners// Assuming you have a similar service for fetching orders

export default function Order({ color }) {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Thêm state loading

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const result = await getOrderAdmin();
            setOrders(result || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false)
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

    // Navigate to the order detail page
    const handleViewOrder = (orderId) => {
        navigate(`/admin/order/detail/${orderId}`);
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
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                    </div>
                ) : (
                    <div className="block w-full overflow-x-auto">
                        {/* Orders table */}
                        <table className="items-center w-full bg-transparent border-collapse table-fixed">
                            <thead>
                            <tr>
                                <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    STT
                                </th>
                                <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "20%"}}>
                                    Tên người dùng
                                </th>
                                <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "20%"}}>
                                    Thành Tiền
                                </th>
                                <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    Trạng Thái
                                </th>
                                <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
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
                                                className={"ml-3 font-bold " + (color === "light" ? "text-blueGray-600" : "text-white")}>
                                                {index + 1}
                                            </span>
                                        </th>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {order.user_name}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {formatVND(order.total_amount)}
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
                                                onClick={() => handleEditOrder(order.id)}
                                            >
                                                <i className="fas fa-pen text-xl"></i>
                                            </button>
                                            <button
                                                className="text-blue-500 hover:text-blue-700 ml-2 px-2"
                                                onClick={() => handleViewOrder(order.id)}
                                            >
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
                )}
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
