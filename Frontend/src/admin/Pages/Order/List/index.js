import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getOrderAdmin, searchOrder } from '../../../../services/Order';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners
import { getUserInfo } from '../../../../services/User';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Order({ color }) {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("0"); // State lưu trữ filter theo status
    const ordersPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        fetchOrders();
    }, [searchTerm, statusFilter]); // Thêm statusFilter vào dependency list

    useEffect(() => {
        const startIndex = (currentPage - 1) * ordersPerPage;
        const endIndex = startIndex + ordersPerPage;
        setDisplayedOrders(orders.slice(startIndex, endIndex));
    }, [currentPage, orders]);
    const removeVietnameseTones = (str) => {
        const accents = {
            a: 'áàảãạâấầẩẫậăắằẳẵặ',
            e: 'éèẻẽẹêếềểễệ',
            i: 'íìỉĩị',
            o: 'óòỏõọôốồổỗộơớờởỡợ',
            u: 'úùủũụưứừửữự',
            y: 'ýỳỷỹỵ',
            d: 'đ'
        };

        for (let nonAccent in accents) {
            const accent = accents[nonAccent];
            str = str.replace(new RegExp([`${accent}`], 'g'), nonAccent);
        }
        return str;
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            let result;
            if (searchTerm.trim() === "") {
                result = await getOrderAdmin(); // Fetch all orders if no search term
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm);
                result = await searchOrder(sanitizedSearchTerm); // Fetch filtered orders
            }

            if (Array.isArray(result)) {
                // Lọc theo status nếu có filter
                const filteredOrders = result.filter(order => {
                    if (statusFilter === "") return true;
                    return order.status === parseInt(statusFilter);
                });
                // Lấy tên người dùng cho từng đơn hàng
                const ordersWithUserNames = await Promise.all(filteredOrders.map(async (order) => {
                    const userName = await fetchUserInfo(order.user_id);
                    return { ...order, user_name: userName };
                }));
                setOrders(ordersWithUserNames);
            } else if (result && result.orders && Array.isArray(result.orders)) {
                const filteredOrders = result.orders.filter(order => {
                    if (statusFilter === "") return true;
                    return order.status === parseInt(statusFilter);
                });
                const ordersWithUserNames = await Promise.all(filteredOrders.map(async (order) => {
                    const userName = await fetchUserInfo(order.user_id);
                    return { ...order, user_name: userName };
                }));
                setOrders(ordersWithUserNames);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error('Lỗi khi lấy đơn hàng:', err);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserInfo = async (userId) => {
        try {
            const userInfo = await getUserInfo(userId);
            return userInfo.name;
        } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
            return 'Người dùng không xác định';
        }
    };

    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const handleEditOrder = (orderId) => {
        navigate(`/admin/order/edit/${orderId}`);
    };

    const handleViewOrder = (orderId) => {
        navigate(`/admin/order/detail/${orderId}`);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(orders.length / ordersPerPage)) {
            setCurrentPage(page);
        }
    };

    const getPaginationPages = (currentPage, totalPages) => {
        const maxVisiblePages = 3;
        const pages = [];

        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            if (currentPage > 3) {
                pages.push("...");
            }

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push("...");
            }

            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <>
            <div
                className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className={"font-bold text-2xl text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")}>
                                - DANH SÁCH ĐƠN HÀNG -
                            </h3>
                        </div>
                    </div>
                </div>
                {/* Input tìm kiếm sản phẩm */}
                <div className="mb-4 px-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full shadow appearance-none focus:outline-none focus:shadow-outline"
                        placeholder="Tìm kiếm danh mục sản phẩm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {/* Dropdown lọc theo status, nằm ở góc phải */}
                <div className="absolute right-4 top-4">
                    <select
                        className="border border-gray-300 rounded px-3 py-2 text-base shadow appearance-none focus:outline-none focus:shadow-outline"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">Chọn trạng thái</option>
                        <option value="0">Đang chờ xác nhận</option>
                        <option value="1">Đang chuẩn bị hàng</option>
                        <option value="2">Đang giao</option>
                        <option value="3">Đã nhận hàng</option>
                        <option value="4">Đã hủy</option>
                    </select>
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
                                <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">
                                    STT
                                </th>
                                <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">
                                    Mã đơn hàng
                                </th>
                                <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">
                                    Tên người dùng
                                </th>
                                <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">
                                    Trạng Thái
                                </th>
                                <th className="px-6 py-3 border border-solid text-center uppercase font-semibold">
                                    Thao tác
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedOrders.length > 0 ? (
                                displayedOrders.map((order, index) => (
                                    <tr key={order.id}>
                                        <th className="border-t-0 px-6 align-middle text-xl text-center whitespace-nowrap p-4 text-left flex items-center">
                                                <span
                                                    className={"ml-3 font-bold text-center " + (color === "light" ? "text-blueGray-600" : "text-white")}>
                                                    {index + 1}
                                                </span>
                                        </th>
                                        <td className="border-t-0 px-6 align-middle text-xl text-center whitespace-nowrap p-4">
                                            {order.order_id}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl text-center whitespace-nowrap p-4">
                                            {order.user_name}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl text-center whitespace-nowrap p-4">
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
                <div className="flex justify-center items-center mt-4 mb-4">
                    {/* Nút Previous */}
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                    >
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>

                    {/* Danh sách số trang */}
                    <div className="flex space-x-1">
                        {getPaginationPages(currentPage, Math.ceil(orders.length / ordersPerPage)).map((page, index) =>
                            page === "..." ? (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm font-bold shadow ${
                                        currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-100 text-gray-800"
                                    } hover:bg-blue-300 hover:shadow-lg transition duration-200`}
                                >
                                    {page}
                                </button>
                            )
                        )}
                    </div>

                    {/* Nút Next */}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(orders.length / ordersPerPage)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                    >
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>
            </div>
        </>
    );
}

Order.propTypes = {
    color: PropTypes.string.isRequired
};
