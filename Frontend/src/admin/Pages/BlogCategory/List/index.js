import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlogCategory, deleteBlogCategory } from '../../../../services/BlogCategory';
import Swal from 'sweetalert2';

export default function BlogCategory({ color }) {
    const [Blogcategories, setBlogcategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); // State to track selected categories
    const [selectAll, setSelectAll] = useState(false); // State to handle select all
    const navigate = useNavigate();

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
            Swal.fire('Error', 'Lỗi khi tải danh mục. Vui lòng thử lại.', 'error');
        }
    };

    const handleEditClick = (id) => {
        navigate(`/admin/category_blog/edit/${id}`);
    };

    const handleDeleteClick = async (category) => {
        const confirmDelete = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa danh mục "${category.name}" không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteBlogCategory(category.id);
                Swal.fire('Thành công', 'Xóa danh mục blog thành công.', 'success');
                fetchBlogcategories();
            } catch (err) {
                console.error('Error deleting category:', err);
                Swal.fire('Error', 'Lỗi khi xóa danh mục. Vui lòng thử lại.', 'error');
            }
        }
    };

    const handleSelectCategory = (id) => {
        setSelectedCategories((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((categoryId) => categoryId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedCategories([]); // Unselect all
        } else {
            setSelectedCategories(Blogcategories.map((category) => category.id)); // Select all categories
        }
        setSelectAll(!selectAll);
    };

    const handleBulkDelete = async () => {
        if (selectedCategories.length === 0) {
            Swal.fire('Chú ý', 'Vui lòng chọn ít nhất một danh mục để xóa.', 'warning');
            return;
        }

        const confirmDelete = await Swal.fire({
            title: 'Xác nhận xóa',
            text: `Bạn có chắc chắn muốn xóa các danh mục đã chọn không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (confirmDelete.isConfirmed) {
            try {
                await Promise.all(selectedCategories.map(id => deleteBlogCategory(id)));
                Swal.fire('Thành công', 'Xóa các danh mục đã chọn thành công.', 'success');
                fetchBlogcategories();
                setSelectedCategories([]); // Clear selection
                setSelectAll(false); // Reset select all checkbox
            } catch (err) {
                console.error('Error deleting categories:', err);
                Swal.fire('Error', 'Lỗi khi xóa các danh mục. Vui lòng thử lại.', 'error');
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
                        <button
                            className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ml-2 mb-1 ease-linear transition-all duration-150"
                            onClick={handleBulkDelete}
                        >
                            Xóa đã chọn
                        </button>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                                chọn
                            </th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Tên danh mục</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Trạng Thái</th>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {Blogcategories.length > 0 ? (
                            Blogcategories.map((category, index) => (
                                <tr key={category.id}>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.id)}
                                            onChange={() => handleSelectCategory(category.id)}
                                        />
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{index + 1}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{category.name}</td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{category.status}</td>
                                    <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 px-2 transition duration-150 ease-in-out"
                                            onClick={() => handleEditClick(category.id)}
                                        >
                                            <i className="fas fa-pen text-xl"></i>
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 ml-2 px-2 transition duration-150 ease-in-out"
                                            onClick={() => handleDeleteClick(category)}
                                        >
                                            <i className="fas fa-trash text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Không có danh mục nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

BlogCategory.defaultProps = {
    color: "light",
};

BlogCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
