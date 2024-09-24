import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlogCategory, deleteBlogCategory } from '../../../../services/BlogCategory';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

export default function BlogCategory({ color }) {
    const [Blogcategories, setBlogcategories] = useState([]);
    const navigate = useNavigate();
    const renderStatus = (status) => (status == "1" ? "Hiển thị" : "Ẩn");

    useEffect(() => {
        fetchBlogcategories();
    }, []);

    const fetchBlogcategories = async () => {
        try {
            const result = await getBlogCategory();
            setBlogcategories(result || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setBlogcategories([]);
            toast.error('Error fetching categories. Please try again later.');
        }
    };

    const handleEditClick = (id) => {
        navigate(`/admin/category_blog/edit/${id}`);
    };

    // Handle Delete Click with SweetAlert2
    const handleDeleteClick = async (category) => {
        const { isConfirmed } = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Xóa',
            cancelButtonText: 'Hủy',
        });

        if (isConfirmed) {
            try {
                await deleteBlogCategory(category.id);
                await Swal.fire({
                    title: 'Thành công!',
                    text: 'Xóa danh mục bài viết thành công.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                fetchBlogcategories();
            } catch (err) {
                console.error('Error deleting category:', err);
                toast.error('Lỗi khi xóa danh mục. Vui lòng thử lại.');
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
                                DANH MỤC BÀI VIẾT
                            </h3>
                        </div>
                        <NavLink
                            to={`/admin/category_blog/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                        >
                            Thêm danh mục
                        </NavLink>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")} style={{width: "10%"}}>STT</th>
                            <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")} style={{width: "10%"}}>Tên danh mục</th>
                            <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")} style={{width: "10%"}}>Trạng Thái</th>
                            <th className={"px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " + (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")} style={{width: "10%"}}>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Blogcategories.length > 0 ? (
                            Blogcategories.map((category, index) => (
                                <tr key={category.id}>
                                    <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                        <span className="ml-3 font-bold">{index + 1}</span>
                                    </th>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {category.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {renderStatus(category.status)}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 px-2"
                                            onClick={() => handleEditClick(category.id)}
                                        >
                                            <i className="fas fa-pen text-xl"></i>
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 ml-2 px-2"
                                            onClick={() => handleDeleteClick(category)}
                                        >
                                            <i className="fas fa-trash text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center">Không có danh mục nào</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ToastContainer />
        </>
    );
}

BlogCategory.defaultProps = {
    color: "light",
};

BlogCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
