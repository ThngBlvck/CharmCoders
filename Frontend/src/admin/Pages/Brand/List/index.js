import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBrand, deleteBrand,searchBrand } from '../../../../services/Brand';
import Swal from 'sweetalert2';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Brand({ color }) {
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState(new Set()); // Track selected brands
    const navigate = useNavigate();
    const renderStatus = (status) => (status == "1" ? "Hiển thị" : "Ẩn");
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Thêm state loading
    const brandsPerPage = 5; // Số sản phẩm trên mỗi trang
    const [searchTerm, setSearchTerm] = useState(""); // State lưu trữ từ khóa tìm kiếm
    const [displayedBrands, setDisplayedBrands] = useState([]);
    useEffect(() => {
        fetchBrands();
    }, [searchTerm]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * brandsPerPage;
        const endIndex = startIndex + brandsPerPage;
        setDisplayedBrands(brands.slice(startIndex, endIndex));
    }, [currentPage, brands]);

    const fetchBrands = async () => {
        try {
            setLoading(true); // Bắt đầu loading
            let result;

            if (searchTerm.trim() === "") {
                result = await getBrand(); // Lấy tất cả nhãn hàng nếu không có từ khóa tìm kiếm
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm.trim()).toLowerCase(); // Loại bỏ dấu và chuyển về chữ thường
                console.log('Tìm kiếm: ', sanitizedSearchTerm); // Ghi log từ khóa tìm kiếm
                result = await getBrand(); // Lấy tất cả nhãn hàng trước

                // Lọc nhãn hàng tại client sau khi lấy dữ liệu
                result = result.filter(brand =>
                    removeVietnameseTones(brand.name).toLowerCase().includes(sanitizedSearchTerm)
                );
            }

            console.log('Danh sách nhãn hàng: ', result); // Log kết quả trả về từ API

            if (Array.isArray(result)) {
                setBrands(result); // Nếu kết quả là một mảng
            } else if (result?.brands && Array.isArray(result.brands)) {
                setBrands(result.brands); // Nếu kết quả có trường 'brands' là một mảng
            } else {
                setBrands([]); // Đặt danh sách rỗng nếu không có dữ liệu hợp lệ
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhãn hàng:", error);
            setBrands([]); // Đặt danh sách rỗng nếu xảy ra lỗi
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false); // Kết thúc loading
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
        navigate(`/admin/brand/edit/${id}`);
    };

    const handleDeleteClick = async (brand) => {
        // Lần xác nhận đầu tiên
        const firstConfirm = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa nhãn hàng "${brand.name}" không?`,
            text: "Hãy kiểm tra lại trước khi thực hiện hành động này.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (firstConfirm.isConfirmed) {
            // Lần xác nhận thứ hai
            const secondConfirm = await Swal.fire({
                title: `Xác nhận lần nữa: Bạn thực sự muốn xóa nhãn hàng "${brand.name}"?`,
                text: "Hành động này không thể hoàn tác.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Chắc chắn',
                cancelButtonText: 'Hủy',
            });

            if (secondConfirm.isConfirmed) {
                try {
                    await deleteBrand(brand.id); // Xóa nhãn hàng
                    Swal.fire('Thành công', 'Xóa nhãn hàng thành công.', 'success');
                    fetchBrands(); // Tải lại danh sách nhãn hàng sau khi xóa
                } catch (err) {
                    console.error('Error deleting brand:', err);
                    Swal.fire('Lỗi', 'Lỗi khi xóa nhãn hàng. Vui lòng thử lại.', 'error');
                }
            }
        }
    };



    const handleBulkDelete = async () => {
        if (selectedBrands.size === 0) {
            Swal.fire('Lỗi', 'Chưa chọn nhãn hàng nào để xóa.', 'warning');
            return;
        }

        // Lần xác nhận đầu tiên
        const firstConfirm = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${selectedBrands.size} nhãn hàng đã chọn không?`,
            text: "Hãy kiểm tra lại trước khi thực hiện hành động này.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (!firstConfirm.isConfirmed) {
            return; // Người dùng hủy bỏ lần xác nhận đầu tiên
        }

        // Lần xác nhận thứ hai
        const secondConfirm = await Swal.fire({
            title: `Xác nhận lần nữa: Bạn thực sự muốn xóa ${selectedBrands.size} nhãn hàng đã chọn?`,
            text: "Hành động này không thể hoàn tác.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Chắc chắn',
            cancelButtonText: 'Hủy',
        });

        if (secondConfirm.isConfirmed) {
            try {
                // Duyệt qua danh sách các nhãn hàng được chọn và xóa từng nhãn hàng
                for (let brandId of selectedBrands) {
                    await deleteBrand(brandId);
                }

                Swal.fire('Thành công', 'Đã xóa nhãn hàng đã chọn.', 'success');
                fetchBrands(); // Tải lại danh sách nhãn hàng sau khi xóa
                setSelectedBrands(new Set()); // Xóa trạng thái lựa chọn
            } catch (err) {
                console.error('Error deleting selected brands:', err);
                Swal.fire('Lỗi', 'Xảy ra lỗi khi xóa các nhãn hàng. Vui lòng thử lại.', 'error');
            }
        }
    };


    const handleSelectBrand = (id) => {
        const updatedSelection = new Set(selectedBrands);
        if (updatedSelection.has(id)) {
            updatedSelection.delete(id);
        } else {
            updatedSelection.add(id);
        }
        setSelectedBrands(updatedSelection);
    };

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            const allBrandIds = brands.map((brand) => brand.id);
            setSelectedBrands(new Set(allBrandIds));
        } else {
            setSelectedBrands(new Set());
        }
    };

// Tính trạng thái checkbox "Chọn tất cả"
    const isAllSelected = brands.length > 0 && selectedBrands.size === brands.length;


    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(brands.length / brandsPerPage)) {
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
                                style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                            >
                               - DANH SÁCH NHÃN HÀNG -
                            </h3>
                        </div>
                        <NavLink
                            to={`/admin/brand/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                        >
                            THÊM NHÃN HÀNG
                        </NavLink>
                    </div>
                </div>
                {/* Input tìm kiếm sản phẩm */}
                <div className="mb-4 px-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full shadow appearance-none focus:outline-none focus:shadow-outline"
                        placeholder="Tìm kiếm nhãn hàng..."
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
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol" +
                                    (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}>
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={isAllSelected}
                                    />
                                </th>

                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol" +
                                    (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}
                                >STT
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol" +
                                    (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "15%"}}
                                >Hình ảnh
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol" +
                                    (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "25%"}}
                                >Tên nhãn hàng
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol" +
                                    (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}
                                >Trạng Thái
                                </th>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol" +
                                    (color === "light" ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100" : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")}
                                    style={{width: "10%"}}
                                >Hành động
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedBrands.length > 0 ? (
                                displayedBrands.map((brand, index) => (
                                    <tr key={brand.id}>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedBrands.has(brand.id)}
                                                onChange={() => handleSelectBrand(brand.id)}
                                            />
                                        </td>
                                        <th className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4">
                                        <span className="ml-3 font-bold">
                                            {index + 1}
                                        </span>
                                        </th>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">
                                            <img src={brand.image} className="w-16 h-16 object-cover center"/>
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">
                                            {brand.name}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-center whitespace-nowrap p-4">
                                            {renderStatus(brand.status)}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xs text-center whitespace-nowrap p-4">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 px-2"
                                                onClick={() => handleEditClick(brand.id)}
                                            >
                                                <i className="fas fa-pen text-xl"></i>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 ml-2 px-2"
                                                onClick={() => handleDeleteClick(brand)}
                                            >
                                                <i className="fas fa-trash text-xl"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        Không có nhãn hàng nào
                                    </td>
                                </tr>
                            )}
                            </tbody>
                            {selectedBrands.size > 0 && ( // Render the delete button only if there are selected brands
                                <div className="flex justify-start mt-4">
                                    <button
                                        className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none"
                                        type="button"
                                        onClick={handleBulkDelete}
                                    >
                                        XÓA đã CHỌN
                                    </button>
                                </div>
                            )}
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
                        {getPaginationPages(currentPage, Math.ceil(brands.length / brandsPerPage)).map((page, index) =>
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
                        disabled={currentPage === Math.ceil(brands.length / brandsPerPage)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                    >
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>
            </div>
        </>
    );
}

Brand.defaultProps = {
    color: "light",
};

Brand.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
