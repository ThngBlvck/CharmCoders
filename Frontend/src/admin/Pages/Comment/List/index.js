import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getComments, deleteComment, getProductWithUserNames } from "../../../../services/Comment"; // Adjust imports as necessary
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Comment({ color, userId }) {
    const [comments, setComments] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState({}); // State to hold user data
    const [loadingId, setLoadingId] = useState(null);

    useEffect(() => {
        fetchComments();
        fetchProductData();
    }, []);

    // Fetch comments and filter by userId
    const fetchComments = async () => {
        try {
            const userComments = await getComments();
            const filteredComments = userId
                ? userComments.filter(comment => comment.userId === userId)
                : userComments;
            setComments(filteredComments);
        } catch (error) {
            console.error("Failed to fetch comments", error);
        }
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

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
                <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
                    Bình luận
                </h3>
                {selectedComments.length > 0 && (
                    <button className="bg-red-500 text-white px-3 py-2 rounded" onClick={handleBulkDelete}>
                        Xoá ({selectedComments.length}) Bản
                    </button>
                )}
            </div>
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
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Nội dung</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Người dùng</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Sản phẩm</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Trạng Thái</th>
                        <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {comments.map((comment, index) => {
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
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{userName}</td>
                                <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{productName}</td>
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
