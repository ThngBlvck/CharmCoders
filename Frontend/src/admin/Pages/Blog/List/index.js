import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlog, deleteBlog } from '../../../../services/Blog';
import Swal from 'sweetalert2';

export default function BlogList({ color }) {
    const [blogs, setBlogs] = useState([]);
    const [selectedBlogs, setSelectedBlogs] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            const result = await getBlog();
            setBlogs(result || []);
        } catch (err) {
            console.error('Error fetching blog list:', err);
            setBlogs([]);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Lỗi khi tải danh sách bài viết. Vui lòng thử lại sau.'
            });
        }
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
                        {blogs.length > 0 ? (
                            blogs.map((blog, index) => (
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
                                <td colSpan="7" className="text-center">
                                    Không có bài viết nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {selectedBlogs.length > 0 && (
                    <div className="px-4 py-3">
                        <button
                            className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none"
                            onClick={handleBulkDelete}
                        >
                            Xóa đã chọn
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

BlogList.defaultProps = {
    color: "light",
};

BlogList.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
