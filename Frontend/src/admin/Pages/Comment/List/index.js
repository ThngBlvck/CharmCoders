import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getComments, deleteComment, getProductWithUserNames } from "../../../../services/Comment"; // Adjust imports as necessary
import Swal from 'sweetalert2'; // Import SweetAlert2
import { PulseLoader } from 'react-spinners';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons"; // Import PulseLoader từ react-spinners

export default function Comment({ color, userId }) {
    const [comments, setComments] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState({}); // State to hold user data
    const [loadingId, setLoadingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Thêm state loading
    const productsPerPage = 5; // Số sản phẩm trên mỗi trang

    useEffect(() => {
        fetchComments();
        fetchProductData();
    }, []);

    // Fetch comments and filter by userId
    const fetchComments = async () => {
        setLoading(true)
        try {
            const userComments = await getComments();

            const filteredComments = userId
                ? userComments.filter(comment => comment.userId === userId)
                : userComments;
            setComments(filteredComments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
        finally {
            setLoading(false)
        }
        console.log(setComments);
    };

    // Fetch product data
    const fetchProductData = async () => {
        try {
            const productData = await getProductWithUserNames();
            setProducts(productData);
            // Assuming productData contains user information, we can create a user map here
            const userMap = {};
            productData.forEach(product => {
                userMap[product.userId] = product.userName; // Map userId to userName
            });
            setUsers(userMap); // Store user map in state
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    // Handle selecting comments for bulk delete
    const handleSelectComment = (id) => {
        setSelectedComments((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((commentId) => commentId !== id)
                : [...prevSelected, id]
        );
    };

    const handleDelete = async (id) => {
        // Use SweetAlert2 for confirmation
        const result = await Swal.fire({
            title: 'Bạn có chắc không?',
            text: "Bạn sẽ không thể khôi phục lại điều này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (result.isConfirmed) {
            try {
                setLoadingId(id); // Set loading ID
                await deleteComment(id);
                // Optionally show success message
                Swal.fire(
                    'Đã xóa!',
                    'Bình luận của bạn đã được xóa.',
                    'success'
                );
                // Refresh comments after deletion
                fetchComments();
            } catch (error) {
                console.error("Error deleting comment:", error);
                Swal.fire(
                    'Lỗi!',
                    'Đã có sự cố khi xóa bình luận của bạn.',
                    'error'
                );
            } finally {
                setLoadingId(null); // Reset loading ID
            }
        }
    };

    // Handle bulk delete
    const handleBulkDelete = async () => {
        const result = await Swal.fire({
            title: 'Bạn có chắc không?',
            text: `Bạn sắp xóa ${selectedComments.length} bình luận!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có',
        });

        if (result.isConfirmed) {
            try {
                await Promise.all(selectedComments.map(id => deleteComment(id)));
                setComments((prevComments) => prevComments.filter(comment => !selectedComments.includes(comment.id)));
                setSelectedComments([]);
                Swal.fire(
                    'Đã xóa!',
                    'Các bình luận đã chọn đã được xóa.',
                    'success'
                );
            } catch (error) {
                console.error("Failed to delete comments", error);
                Swal.fire(
                    'Lỗi!',
                    'Đã có sự cố khi xóa các bình luận.',
                    'error'
                );
            }
        }
    };


    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(comments.length / productsPerPage)) {
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
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
                <h3 className={`font-bold text-2xl text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`
                    } style={{fontFamily: 'Roboto, sans-serif'}} >
                    - DANH SÁCH BÌNH LUẬN -
                </h3>
                {selectedComments.length > 0 && (
                    <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={handleBulkDelete}>
                        Xoá ({selectedComments.length}) Bản
                    </button>
                )}
            </div>
            { loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            ) : (
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                                <input
                                    type="checkbox"
                                    onChange={(e) => setSelectedComments(e.target.checked ? comments.map(c => c.id) : [])}
                                    checked={selectedComments.length === comments.length}
                                />
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Nội
                                dung
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Người
                                dùng
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Sản
                                phẩm
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Trạng
                                Thái
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hành
                                động
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {comments.map((comment, index) => {
                            console.log(comments);
                            // Find product name using productId
                            const product = products.find(p => p.id === comment.productId);
                            const productName = product ? product.productName : 'Sản phẩm không xác định';
                            const userName = users[comment.userId] || 'Người dùng không xác định'; // Get user name from user map

                            return (
                                <tr key={comment.id}>
                                    <td className="border-t-0 px-6 align-middle text-left flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedComments.includes(comment.id)}
                                            onChange={() => handleSelectComment(comment.id)}
                                        />
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{index + 1}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{comment.content}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{comment.user_name}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{comment.product_name}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{comment.status}</td>
                                    <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                        <button
                                            aria-label="Delete comment"
                                            className={`text-red-500 hover:text-red-700 ml-2 px-2 ${loadingId === comment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            onClick={() => handleDelete(comment.id)}
                                            disabled={loadingId === comment.id}
                                        >
                                            <i className="fas fa-trash text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
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
                    {getPaginationPages(currentPage, Math.ceil(comments.length / productsPerPage)).map((page, index) =>
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
                    disabled={currentPage === Math.ceil(comments.length / productsPerPage)}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                >
                    <FontAwesomeIcon icon={faChevronRight}/>
                </button>
            </div>
        </div>
    );
}

Comment.defaultProps = {
    color: "light",
};

Comment.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
    userId: PropTypes.string, // Added userId prop to filter comments
};
