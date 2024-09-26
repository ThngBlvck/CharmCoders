import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getCategory, deleteCategory } from "../../../../services/Category";
import Swal from 'sweetalert2';

export default function ProductCategory({ color = "light" }) {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const result = await getCategory();
            setCategories(result);
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục danh mục này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter(category => category.id !== id));
                Swal.fire(
                    'Đã xóa!',
                    'Danh mục đã được xóa.',
                    'success'
                );
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
                Swal.fire(
                    'Có lỗi xảy ra!',
                    'Không thể xóa danh mục này.',
                    'error'
                );
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/category_product/edit/${id}`);
    };

    const getStatusText = (status) => {
        return status === 1 ? "Hiện" : "Ẩn"; // Chuyển đổi trạng thái
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
                                DANH MỤC SẢN PHẨM
                            </h3>
                        </div>
                        <NavLink to={`/admin/category_product/add`}
                                 className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                 type="button">
                            Thêm Danh Mục Sản Phẩm
                        </NavLink>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "10%" }}
                            >
                                STT
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "40%" }}
                            >
                                Tên danh mục
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "25%" }}
                            >
                                Trạng Thái
                            </th>
                            <th
                                className={
                                    "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                    (color === "light"
                                        ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                        : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                                }
                                style={{ width: "25%" }}
                            >
                                Hành động
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories ? (
                            categories.map((category, index) => (
                                <tr key={category.id}>
                                    <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                        <span
                                            className={
                                                "ml-3 font-bold " +
                                                (color === "light" ? "text-blueGray-600" : "text-white")
                                            }
                                        >
                                            {index + 1}
                                        </span>
                                    </th>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {category.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {getStatusText(category.status)} {/* Hiển thị trạng thái */}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 px-2"
                                            onClick={() => handleEdit(category.id)}
                                        >
                                            <i className="fas fa-pen text-xl"></i>
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 ml-2 px-2"
                                            onClick={() => handleDelete(category.id)}
                                        >
                                            <i className="fas fa-trash text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center p-4">
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

ProductCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
