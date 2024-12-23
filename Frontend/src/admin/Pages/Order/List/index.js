import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { getOrderAdmin, searchOrder, updateOrder } from '../../../../services/Order';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners
import { getUserInfo } from '../../../../services/User';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Swal from 'sweetalert2';

export default function Order({ color }) {
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState(""); // State lưu trữ filter theo status
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
                // Dữ liệu đã có user_name từ API trả về, không cần gọi lại API để lấy thông tin người dùng
                setOrders(filteredOrders);
            } else if (result && result.orders && Array.isArray(result.orders)) {
                const filteredOrders = result.orders.filter(order => {
                    if (statusFilter === "") return true;
                    return order.status === parseInt(statusFilter);
                });
                setOrders(filteredOrders);
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


    const formatVND = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
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


    const handleStatusChange = async (id, status) => {
        let cancellationReason = null;

        if (status === 4) {
            // Hiển thị hộp thoại nhập lý do hủy
            const { value: reason } = await Swal.fire({
                title: "Nhập lý do hủy đơn",
                input: "textarea",
                inputPlaceholder: "Hãy nhập lý do hủy đơn...",
                inputValidator: (value) => {
                    if (!value) {
                        return "Bạn phải nhập lý do hủy!";
                    }
                },
                showCancelButton: true,
                confirmButtonText: "Gửi",
                cancelButtonText: "Hủy",
            });

            if (!reason) {
                // Người dùng hủy bỏ nhập lý do
                return;
            }

            // Gán lý do hủy đơn hàng
            cancellationReason = reason;
        }

        // Xác nhận cập nhật trạng thái
        const result = await Swal.fire({
            title: "Xác nhận thay đổi trạng thái?",
            text: "Bạn có chắc muốn cập nhật trạng thái này không?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Đồng ý",
            cancelButtonText: "Hủy",
        });

        if (result.isConfirmed) {
            try {
                // Gọi API để cập nhật trạng thái
                const response = await updateOrder(id, status, cancellationReason);

                if (response.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Thành công",
                        text: response.message || "Cập nhật trạng thái thành công!",
                    });

                    // Cập nhật danh sách đơn hàng
                    setOrders((prevOrders) =>
                        prevOrders.map((order) =>
                            order.id === id
                                ? { ...order, status: status, cancellation_reason: cancellationReason }
                                : order
                        )
                    );
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Thất bại",
                        text: response.message || "Cập nhật trạng thái thất bại!",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái:", error);
                Swal.fire({
                    icon: "error",
                    title: "Lỗi",
                    text: "Đã xảy ra lỗi khi cập nhật trạng thái!",
                });
            }
        }
    };






    return (
        <>
            <div
                className={"relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " + (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")}
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className="font-bold text-2xl text-blueGray-700"
                                style={{ fontFamily: "Roboto, sans-serif" }}>
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
                <div className="mb-4 px-4 flex justify-start space-x-2">
                    {[
                        { value: "", label: "Tất cả" },
                        { value: "0", label: "Đang chờ xác nhận" },
                        { value: "1", label: "Đang chuẩn bị hàng" },
                        { value: "2", label: "Đang giao" },
                        { value: "3", label: "Đã nhận hàng" },
                        { value: "4", label: "Đã hủy" }
                    ].map((status) => (
                        <button
                            key={status.value}
                            className={`px-3 py-2 text-sm font-medium rounded shadow ${statusFilter === status.value
                                ? "bg-blue-500 text-white"
                                : "bg-gray-100 "
                                } hover:bg-blue-300`}
                            onClick={() => setStatusFilter(status.value)}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15} />
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
                                                    className={"ml-3 font-bold align-middle text-center " + (color === "light" ? "text-blueGray-600" : "text-white")}>
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
                                                {order.status === 2 || order.status === 3 || order.status === 4 ? (
                                                    // Display text if the order is "Đang giao", "Đã nhận hàng", or "Đã hủy"
                                                    <span>{order.status === 2 ? "Đang giao" : order.status === 3 ? "Đã nhận hàng" : "Đã hủy"}</span>
                                                ) : (
                                                    // Display the dropdown if the order is not in the statuses that should be non-editable
                                                    <select
                                                        value={order.status}
                                                        onChange={(e) => handleStatusChange(order.id, parseInt(e.target.value))}
                                                        className="border rounded px-2 py-1 text-lg shadow focus:outline-none bg-white  w-full"
                                                    >
                                                        {order.status === 0 && (
                                                            <>
                                                                <option value="0" > Chờ xác nhận</option>
                                                                <option value="1" > Chuẩn bị hàng</option>
                                                                <option value="4" > Đã hủy</option>
                                                            </>
                                                        )}
                                                        {order.status === 1 && (
                                                            <>
                                                                <option value="1" >Chuẩn bị hàng</option>
                                                                <option value="2" >Đang giao</option>
                                                            </>
                                                        )}\

                                                    </select>

                                                )}
                                            </td>


                                            <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4 text-center">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 ml-2 px-2"
                                                    onClick={() => handleViewOrder(order.id)}
                                                >
                                                    <i className="fas fa-eye text-xl "></i><span className="text-center text-xl ">Xem chi tiết</span>
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
                        <FontAwesomeIcon icon={faChevronLeft} />
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
                                    className={`w-10 h-10 flex items-center justify-center border rounded-full text-sm font-bold shadow ${currentPage === page
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
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </div>
        </>
    );
}
Order.defaultProps = {
    color: "light",
};
Order.propTypes = {
    color: PropTypes.string.isRequired
};