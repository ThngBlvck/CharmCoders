import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBrand, deleteBrand } from '../../../../services/Brand';
import Swal from 'sweetalert2';

export default function Brand({ color }) {
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState(new Set()); // Track selected brands
    const navigate = useNavigate();
    const renderStatus = (status) => (status == "1" ? "Hiển thị" : "Ẩn");

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const result = await getBrand();
            setBrands(result || []);
        } catch (err) {
            console.error('Error fetching brands:', err);
            setBrands([]);
            Swal.fire('Lỗi', 'Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.', 'error');
        }
    };

    const handleEditClick = (id) => {
        navigate(`/admin/brand/edit/${id}`);
    };

    const handleDeleteClick = async (brand) => {
        const confirmDelete = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa nhãn hàng "${brand.name}" không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteBrand(brand.id);
                Swal.fire('Thành công', 'Xóa nhãn hàng thành công.', 'success');
                fetchBrands();
            } catch (err) {
                console.error('Error deleting brand:', err);
                Swal.fire('Lỗi', 'Lỗi khi xóa nhãn hàng. Vui lòng thử lại.', 'error');
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selectedBrands.size === 0) {
            Swal.fire('Lỗi', 'Chưa chọn nhãn hàng nào để xóa.', 'warning');
            return;
        }

        const confirmBulkDelete = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${selectedBrands.size} nhãn hàng đã chọn không?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (confirmBulkDelete.isConfirmed) {
            for (let brandId of selectedBrands) {
                try {
                    await deleteBrand(brandId);
                } catch (err) {
                    console.error('Error deleting brand:', err);
                }
            }
            Swal.fire('Thành công', 'Đã xóa nhãn hàng đã chọn.', 'success');
            fetchBrands(); // Refresh the list after deletion
            setSelectedBrands(new Set()); // Clear selection
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
                                DANH SÁCH NHÃN HÀNG
                            </h3>
                        </div>
                        <NavLink
                            to={`/admin/brand/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                        >
                            THÊM NHÃN HÀNG
                        </NavLink>
                        <button
                            className="bg-red-500 text-white active:bg-red-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                            onClick={handleBulkDelete}
                        >
                            XÓA CHỌN
                        </button>
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border border-solid text-xs uppercase font-semibold text-left"
                                style={{ width: "10%" }}
                            >Chọn</th>
                            <th className={
                                "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }
                                style={{ width: "10%" }}
                            >STT</th>
                            <th className={
                                "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }
                                style={{ width: "15%" }}
                            >Hình ảnh</th>
                            <th className={
                                "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }
                                style={{ width: "25%" }}
                            >Tên nhãn hàng</th>
                            <th className={
                                "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }
                                style={{ width: "10%" }}
                            >Trạng Thái</th>
                            <th className={
                                "px-6 py-3 border border-solid text-xs uppercase font-semibold text-left " +
                                (color === "light"
                                    ? "bg-blueGray-50 text-blueGray-500 border-blueGray-100"
                                    : "bg-lightBlue-800 text-lightBlue-300 border-lightBlue-700")
                            }
                                style={{ width: "10%" }}
                            >Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {brands.length > 0 ? (
                            brands.map((brand, index) => (
                                <tr key={brand.id}>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left">
                                        <input
                                            type="checkbox"
                                            checked={selectedBrands.has(brand.id)}
                                            onChange={() => handleSelectBrand(brand.id)}
                                        />
                                    </td>
                                    <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                            <span className="ml-3 font-bold">
                                                {index + 1}
                                            </span>
                                    </th>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        <img src={brand.image} className="w-16 h-16 object-cover center" />
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {brand.name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        {renderStatus(brand.status)}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-xs whitespace-nowrap p-4">
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
                    </table>
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
