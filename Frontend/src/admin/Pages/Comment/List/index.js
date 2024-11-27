import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getComments, deleteComment, getBlogWithUserNames } from "../../../../services/Comment";
import Swal from 'sweetalert2';
import { PulseLoader } from 'react-spinners';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Comment({ color, userId }) {
    const [comments, setComments] = useState([]);
    const [selectedComments, setSelectedComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingId, setLoadingId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 5;

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setLoading(true);
        try {
            // Fetch tất cả comments
            const allComments = await getComments();

            // Lọc comment theo userId nếu cần
            const filteredComments = userId
                ? allComments.filter(comment => comment.userId === userId)
                : allComments;

            // Lấy thông tin blog và người dùng kèm theo
            const enrichedComments = await Promise.all(
                filteredComments.map(async (comment) => {
                    const blogData = await getBlogWithUserNames();
                    const blog = blogData.find(blog => blog.id === comment.blogId);
                    return {
                        ...comment,
                        blogTitle: blog ? blog.blogTitle : "Bài viết không xác định",
                        userName: blog ? blog.userName : "Người dùng không xác định",
                    };
                })
            );

            setComments(enrichedComments);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc không?',
            text: "Bạn sẽ không thể khôi phục điều này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (result.isConfirmed) {
            try {
                setLoadingId(id);
                await deleteComment(id);
                Swal.fire('Đã xóa!', 'Bình luận đã được xóa.', 'success');
                fetchComments();
            } catch (error) {
                console.error("Error deleting comment:", error);
                Swal.fire('Lỗi!', 'Không thể xóa bình luận.', 'error');
            } finally {
                setLoadingId(null);
            }
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(comments.length / productsPerPage)) {
            setCurrentPage(page);
        }
    };

    const paginatedComments = comments.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    );

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0 flex justify-between items-center">
                <h3 className={`font-bold text-2xl text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
                    - DANH SÁCH BÌNH LUẬN -
                </h3>
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15} />
                </div>
            ) : (
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">STT</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Nội dung</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Tên bài viết</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Người bình luận</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedComments.map((comment, index) => (
                            <tr key={comment.id}>
                                <td className="border-t-0 px-6 text-left">{index + 1}</td>
                                <td className="border-t-0 px-6 text-left">{comment.content}</td>
                                <td className="border-t-0 px-6 text-left">{comment.blogTitle}</td>
                                <td className="border-t-0 px-6 text-left">{comment.user_name}</td>
                                <td className="border-t-0 px-6 text-left">
                                    <button
                                        className={`text-red-500 hover:text-red-700 ${loadingId === comment.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleDelete(comment.id)}
                                        disabled={loadingId === comment.id}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <div className="flex justify-center items-center mt-4 mb-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className="mx-2">{currentPage}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(comments.length / productsPerPage)}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
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
    userId: PropTypes.string,
};
