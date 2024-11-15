import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getCategory, deleteCategory, searchCategory } from "../../../../services/Category";
import Swal from 'sweetalert2';
import { PulseLoader } from "react-spinners"; // Hàm lấy danh sách danh mục

export default function ProductCategory({ color = "light" }) {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]); // Lưu trữ các danh mục đã chọn
    const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 3; // Số sản phẩm trên mỗi trang
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [displayedProducts, setDisplayedProducts] = useState([]);
    useEffect(() => {
        fetchCategories();
    }, [searchTerm]);
    // Hàm để tính số trang
    useEffect(() => {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        setDisplayedProducts(categories.slice(startIndex, endIndex));
    }, [currentPage, categories]);

    const fetchCategories = async () => {
        try {
            setLoading(true); // Start loading
            let result;
            if (searchTerm.trim() === "") {
                result = await getCategory(); // Fetch all categories if no search term
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm); // Remove accents from search term
                result = await searchCategory(sanitizedSearchTerm); // Fetch filtered categories based on the sanitized search term
            }

            if (Array.isArray(result)) {
                setCategories(result); // Set categories if result is an array
            } else if (result && result.categories && Array.isArray(result.categories)) {
                setCategories(result.categories); // Set categories if result contains a 'categories' field
            } else {
                setCategories([]); // Set empty categories if no valid result
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh mục sản phẩm:", error);
            setCategories([]); // Set empty categories if error occurs
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

    const handleDeleteSelected = async () => {
        const result = await Swal.fire({
            title: 'Bạn có chắc chắn?',
            text: "Bạn sẽ không thể khôi phục các danh mục này!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Có!',
            cancelButtonText: 'Hủy'
        });

        if (result.isConfirmed) {
            try {
                await Promise.all(selectedCategories.map(id => deleteCategory(id)));
                setCategories(categories.filter(category => !selectedCategories.includes(category.id)));
                setSelectedCategories([]); // Clear danh sách đã chọn
                Swal.fire('Đã xóa!', 'Các danh mục đã được xóa.', 'success');
            } catch (error) {
                console.error("Lỗi khi xóa danh mục:", error);
                Swal.fire('Có lỗi xảy ra!', 'Không thể xóa các danh mục này.', 'error');
            }
        }
    };

    const handleSelectCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter(categoryId => categoryId !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handleSelectAll = () => {
        if (selectedCategories.length === categories.length) {
            setSelectedCategories([]);
        } else {
            setSelectedCategories(categories.map(category => category.id));
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/category_product/edit/${id}`);
    };

    const getStatusText = (status) => {
        return status === 1 ? "Hiện" : "Ẩn"; // Chuyển đổi trạng thái
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(categories.length / productsPerPage)) {
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
                                DANH MỤC SẢN PHẨM
                            </h3>
                        </div>
                        <NavLink to={`/admin/category_product/add`}
                                 className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                 type="button">
                            Thêm Sản Phẩm
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
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15} />
                    </div>
                ) : (
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse table-fixed">
                            <thead>
                            <tr>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={selectedCategories.length === setDisplayedProducts.length}
                                    />
                                </th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">STT</th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Tên
                                    danh mục
                                </th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Trạng
                                    thái
                                </th>
                                <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left">Hành
                                    động
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedProducts.length > 0 ? (
                                displayedProducts.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="border-t-0 px-6 py-5 align-middle text-left flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleSelectCategory(category.id)}
                                            />
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{index + 1}</td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {category.name.length > 30 ? category.name.substring(0, 30) + "..." : category.name}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">{getStatusText(category.status)}</td>
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
                                    <td colSpan="5" className="text-center p-4">Không tìm thấy danh mục nào</td>
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
                                Trang {currentPage} / {Math.ceil(categories.length / productsPerPage) || 1}</span>
                            {/* Nút Next */}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === Math.ceil(categories.length / productsPerPage)}
                                className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                &#9654; {/* Mũi tên phải */}
                            </button>
                        </div>
                        {/* Nút xóa hàng loạt */}
                        {selectedCategories.length > 0 && (
                            <div className="mb-4 px-4">
                                <button
                                    className="bg-red-500 text-white text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                                    onClick={handleDeleteSelected}
                                >
                                    Xóa các danh mục đã chọn
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

ProductCategory.propTypes = {
    color: PropTypes.string,
};
