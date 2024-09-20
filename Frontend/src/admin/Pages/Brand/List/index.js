import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBrand, deleteBrand } from '../../../../services/Brand'; // Adjust the path based on your folder structure
import Swal from 'sweetalert2'; // Import SweetAlert2

export default function Brand({ color }) {
    const [brands, setBrands] = useState([]);
    const navigate = useNavigate(); // Initialize useNavigate
    const renderStatus = (status) => (status === "1" ? "Hiển thị" : "Ẩn");

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const result = await getBrand(); // Fetch brands using the API
            setBrands(result || []); // Ensure that it's always an array
        } catch (err) {
            console.error('Error fetching brands:', err);
            setBrands([]); // Set an empty array in case of an error
            Swal.fire('Lỗi', 'Lỗi khi tải danh sách nhãn hàng. Vui lòng thử lại.', 'error');
        }
    };

    // Handle Edit Click
    const handleEditClick = (id) => {
        navigate(`/admin/brand/edit/${id}`);
    };

    // Handle Delete Click
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
                await deleteBrand(brand.id); // Call the delete API
                Swal.fire('Thành công', 'Xóa nhãn hàng thành công.', 'success');
                fetchBrands(); // Refresh the list after deletion
            } catch (err) {
                console.error('Error deleting brand:', err);
                Swal.fire('Lỗi', 'Lỗi khi xóa nhãn hàng. Vui lòng thử lại.', 'error');
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
                    </div>
                </div>
                <div className="block w-full overflow-x-auto">
                    {/* Brand table */}
                    <table className="items-center w-full bg-transparent border-collapse table-fixed">
                        <thead>
                        <tr>
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
                                    <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                                            <span className="ml-3 font-bold">
                                                {index + 1}
                                            </span>
                                    </th>
                                    <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                        <img src={brand.image} className="w-16 h-16 object-cover center"  />
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
                                <td colSpan="5" className="text-center">
                                    Không có nhãn hàng nào
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Remove ToastContainer since we're using SweetAlert2 */}
        </>
    );
}

Brand.defaultProps = {
    color: "light",
};

Brand.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
