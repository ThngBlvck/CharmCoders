import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getOrderAdmin,searchOrder } from '../../../../services/Order';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners// Assuming you have a similar service for fetching orders
import { getUserInfo } from '../../../../services/User';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Order({ color }) {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
    const ordersPerPage = 5; // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        fetchOrders();
    }, [searchTerm]);
    // Hàm để tính số trang
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
            str = str.replace(new RegExp(`[${accent}]`, 'g'), nonAccent);
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
                // Lấy tên người dùng cho từng đơn hàng
                const ordersWithUserNames = await Promise.all(result.map(async (order) => {
                    const userName = await fetchUserInfo(order.user_id); // Lấy tên người dùng từ user_id
                    return { ...order, user_name: userName }; // Thêm tên người dùng vào đơn hàng
                }));
                setOrders(ordersWithUserNames);
            } else if (result && result.orders && Array.isArray(result.orders)) {
                // Lấy tên người dùng cho từng đơn hàng trong trường hợp có kết quả orders
                const ordersWithUserNames = await Promise.all(result.orders.map(async (order) => {
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
            return userInfo.name; // Giả sử tên người dùng nằm trong trường `name`
        } catch (err) {
            console.error('Lỗi khi lấy thông tin người dùng:', err);
            return 'Người dùng không xác định'; // Giá trị mặc định nếu có lỗi
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
    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(orders.length / ordersPerPage)) {
            setCurrentPage(page);
        }
    };

    const getPaginationPages = (currentPage, totalPages) => {
        const maxVisiblePages = 3; // Số trang liền kề hiển thị
        const pages = [];

        if (totalPages <= maxVisiblePages + 2) {
            // Nếu tổng số trang ít, hiển thị tất cả
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Luôn hiển thị trang đầu
            pages.push(1);

            if (currentPage > 3) {
                // Nếu trang hiện tại cách đầu > 2, thêm "..."
                pages.push("...");
            }

            // Thêm các trang liền kề (trang hiện tại và 2 bên)
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                // Nếu trang hiện tại cách cuối > 2, thêm "..."
                pages.push("...");
            }

            // Luôn hiển thị trang cuối
            pages.push(totalPages);
        }

        return pages;
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
                                    "font-bold text-2xl text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                                style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                            >
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
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    STT
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    Mã đơn hàng
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "20%"}}>
                                    Tên người dùng
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    Trạng Thái
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    Hành động
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
                        {/* Phân trang */}
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
