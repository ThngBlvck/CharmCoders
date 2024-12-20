import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlogCategory, deleteBlogCategory, searchCateBlog } from '../../../../services/BlogCategory';
import Swal from 'sweetalert2';
import {PulseLoader} from "react-spinners"; // Hàm lấy danh sách danh mục
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function BlogCategory({ color }) {
    const [Blogcategories, setBlogcategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [currentPage, setCurrentPage] = useState(1);
    const blogCateriesPerPage = 5; // Số sản phẩm trên mỗi trang
    const [displayedCateBlog, setDisplayedCateBlog] = useState([])
    const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
    useEffect(() => {
        fetchBlogcategories();
    }, [searchTerm]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * blogCateriesPerPage;
        const endIndex = startIndex + blogCateriesPerPage;
        setDisplayedCateBlog(Blogcategories.slice(startIndex, endIndex));
    }, [currentPage, Blogcategories]);

    const fetchBlogcategories = async () => {
        try {
            setLoading(true); // Start loading
            let result;

            // If search term is empty, fetch all categories
            if (searchTerm.trim() === "") {
                result = await getBlogCategory(); // Fetch all blog categories
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm); // Remove accents from the search term
                result = await searchCateBlog(sanitizedSearchTerm); // Fetch filtered categories based on the sanitized search term
            }

            // If result is an array, set the blog categories
            if (Array.isArray(result)) {
                setBlogcategories(result);
            } else if (result && result.categories && Array.isArray(result.categories)) {
                setBlogcategories(result.categories); // Set categories if result contains a 'categories' field
            } else {
                setBlogcategories([]); // Set empty blog categories if no valid result
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setBlogcategories([]); // Set empty categories if error occurs
            Swal.fire('Error', 'Lỗi khi tải danh mục. Vui lòng thử lại.', 'error');
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

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(Blogcategories.length / blogCateriesPerPage)) {
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
                                    "font-bold text-2xl text-lg " +
                                    (color === "light" ? "text-blueGray-700" : "text-white")
                                }
                                style={{fontFamily: 'Roboto, sans-serif'}} // Áp dụng font chữ Roboto
                            >
                                - DANH MỤC BÀI VIẾT -
                            </h3>
                        </div>
                        <NavLink
                            to={`/admin/category_blog/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                        >
                            Thêm danh mục
                        </NavLink>
                        {/* Remove Xóa đã chọn button from here */}
                    </div>
                </div>
                {/* Input tìm kiếm danh mục bài viết */}
                <div className="mb-4 px-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full shadow appearance-none focus:outline-none focus:shadow-outline"
                        placeholder="Tìm kiếm danh mục bài viết..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                    </div>
                ) : (
                    <div className="block w-full overflow-x-auto">
                        <table className="items-center w-full bg-transparent border-collapse table-fixed">
                            <thead>
                            <tr>
                                <th className="w-16 px-2 py-2 border border-solid text-center uppercase font-semibold text-left">
                                    <input
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="w-16 px-2 py-2 border border-solid text-x text-center uppercase font-semibold text-left">STT</th>
                                <th className="px-6 py-3 border border-solid text-x text-center uppercase font-semibold text-left">Tên
                                    danh mục
                                </th>
                                <th className="px-6 py-3 border border-solid text-x text-center uppercase font-semibold text-left">Hành
                                    động
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedCateBlog.length > 0 ? (
                                displayedCateBlog.map((category, index) => (
                                    <tr key={category.id}>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedCategories.includes(category.id)}
                                                onChange={() => handleSelectCategory(category.id)}
                                            />
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">{index + 1}</td>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">{category.name}</td>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">
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
                        {getPaginationPages(currentPage, Math.ceil(Blogcategories.length / blogCateriesPerPage)).map((page, index) =>
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
                        disabled={currentPage === Math.ceil(Blogcategories.length / blogCateriesPerPage)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                    >
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>

                {/* Move Xóa đã chọn button here */}
                {selectedCategories.length > 0 && (
                    <div className="flex justify-end mb-2">
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

BlogCategory.defaultProps = {
    color: "light",
};

BlogCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
