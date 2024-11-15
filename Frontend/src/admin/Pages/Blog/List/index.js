import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlog, deleteBlog,searchBlog  } from '../../../../services/Blog';
import Swal from 'sweetalert2';
import { PulseLoader } from "react-spinners"; // Hàm lấy danh sách danh mục

export default function BlogList({ color }) {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false); // Track loading state
    const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
    const blogsPerPage = 5; // Số sản phẩm trên mỗi trang
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedBlogs, setDisplayedBlogs] = useState([]);
    useEffect(() => {
        fetchBlogs();
    }, [searchTerm]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * blogsPerPage;
        const endIndex = startIndex + blogsPerPage;
        setDisplayedBlogs(blogs.slice(startIndex, endIndex));
    }, [currentPage, blogs]);
    const fetchBlogs = async () => {
        try {
            setLoading(true); // Start loading
            let result;

            if (searchTerm.trim() === "") {
                result = await getBlog(); // Fetch all blogs if no search term
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm.trim()).toLowerCase(); // Remove accents and convert to lowercase
                console.log('Searching for: ', sanitizedSearchTerm); // Log search term
                result = await getBlog(); // Fetch all blogs regardless of search term

                // Filter the blogs locally after fetching the data
                result = result.filter(blog =>
                    removeVietnameseTones(blog.title).toLowerCase().includes(sanitizedSearchTerm) ||
                    removeVietnameseTones(blog.category_name).toLowerCase().includes(sanitizedSearchTerm)
                );
            }

            console.log('Fetched Blogs: ', result); // Log result from API

            if (Array.isArray(result)) {
                setBlogs(result); // Set blogs if result is an array
            } else if (result?.blogs && Array.isArray(result.blogs)) {
                setBlogs(result.blogs); // Set blogs if result contains a 'blogs' field
            } else {
                setBlogs([]); // Set empty blogs if no valid result
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách bài viết:", error);
            setBlogs([]); // Set empty blogs if error occurs
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Lỗi khi tải danh sách bài viết. Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false); // End loading
        }
    };

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
    const handleEditClick = (id) => {
        navigate(`/admin/blog/edit/${id}`);
    };

    const handleDeleteClick = async (blog) => {
        const confirmDelete = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa bài viết "${blog.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không'
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteBlog(blog.id);
                Swal.fire('Đã xóa!', 'Bài viết của bạn đã được xóa.', 'success');
                fetchBlogs();
            } catch (err) {
                console.error('Error deleting post:', err);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Lỗi khi xóa bài viết. Vui lòng thử lại.'
                });
            }
        }
    };

    const handleSelectBlog = (id) => {
        setSelectedBlogs((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((blogId) => blogId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedBlogs([]); // Unselect all
        } else {
            setSelectedBlogs(blogs.map((blog) => blog.id)); // Select all blogs
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async () => {
        if (selectedBlogs.length === 0) {
            Swal.fire('Chú ý', 'Vui lòng chọn ít nhất một bài viết để xóa.', 'warning');
            return;
        }

        const confirmDelete = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa các bài viết đã chọn không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (confirmDelete.isConfirmed) {
            try {
                await Promise.all(selectedBlogs.map(id => deleteBlog(id)));
                Swal.fire('Thành công', 'Xóa các bài viết đã chọn thành công.', 'success');
                fetchBlogs();
                setSelectedBlogs([]); // Clear selection
                setSelectAll(false); // Reset select all checkbox
            } catch (err) {
                console.error('Error deleting posts:', err);
                Swal.fire('Error', 'Lỗi khi xóa các bài viết. Vui lòng thử lại.', 'error');
            }
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(blogs.length / blogsPerPage)) {
            setCurrentPage(page);
        }
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
                                DANH SÁCH BÀI VIẾT
                            </h3>
                        </div>
                        <NavLink
                            to={`/admin/blog/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                        >
                            Thêm bài viết
                        </NavLink>
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
                {/* Loading spinner */}
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15} />
                    </div>
                ) : (
                    <div className="block w-full overflow-x-auto">
                        {/* Blog list table */}
                        <table className="items-center w-full bg-transparent border-collapse table-fixed">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                    <span className="ml-2">Chọn tất cả</span>
                                </th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hình ảnh</th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Tiêu đề</th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Danh mục</th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Trạng thái</th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedBlogs.length > 0 ? (
                                displayedBlogs.map((blog, index) => (
                                    <tr key={blog.id}>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedBlogs.includes(blog.id)}
                                                onChange={() => handleSelectBlog(blog.id)}
                                            />
                                        </td>
                                        <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                            <span className="ml-3 font-bold">{index + 1}</span>
                                        </th>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            <img
                                                src={blog.image || '/placeholder-image.png'}
                                                alt={blog.title}
                                                className="h-16 w-16 object-cover rounded"
                                            />
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {blog.title}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {blog.category_name}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {blog.status === 1 ? 'Hiển thị' : 'Ẩn'}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 px-2"
                                                onClick={() => handleEditClick(blog.id)}
                                            >
                                                <i className="fas fa-pen text-xl"></i>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 ml-2 px-2"
                                                onClick={() => handleDeleteClick(blog)}
                                            >
                                                <i className="fas fa-trash text-xl"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="text-center py-4">
                                        Không có bài viết nào
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                        {/* Phân trang */}
                        <div className="flex justify-center items-center mt-4">
                            {/* Nút Previous */}
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                &#9664; {/* Mũi tên trái */}
                            </button>

                            {/* Trang hiện tại */}
                            <span className="px-4 py-2 mx-1 bg-gray-100 text-gray-800 border rounded">
                                Trang {currentPage} / {Math.ceil(blogs.length / blogsPerPage) || 1}</span>
                            {/* Nút Next */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === Math.ceil(blogs.length / blogsPerPage)}
                                className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                &#9654; {/* Mũi tên phải */}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

BlogList.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
BlogList.defaultProps = {
    color: "light",
};