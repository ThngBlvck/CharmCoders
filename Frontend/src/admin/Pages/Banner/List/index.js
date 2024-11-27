import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getBanner, deleteBanner } from '../../../../services/Banner';
import Swal from "sweetalert2";
import { PulseLoader } from "react-spinners"; // Thư viện loader
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Banner({ color }) {
    const [banners, setBanners] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const bannersPerPage = 5; // Số banner mỗi trang
    const [displayedBanners, setDisplayedBanners] = useState([]);
    const navigate = useNavigate();

    const baseURL = "http://your-domain.com"; // Thay bằng URL gốc của server

    useEffect(() => {
        fetchBanners();
    }, []);

    useEffect(() => {
        const startIndex = (currentPage - 1) * bannersPerPage;
        const endIndex = startIndex + bannersPerPage;
        setDisplayedBanners(banners.slice(startIndex, endIndex));
    }, [currentPage, banners]);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            const result = await getBanner();
            console.log("Danh sách banners:", result); // Debug dữ liệu từ API
            if (Array.isArray(result)) {
                // Chuẩn hóa đường dẫn image_path
                const normalizedBanners = result.map((banner) => ({
                    ...banner,
                    image_path: banner.image_path.startsWith("http")
                        ? banner.image_path
                        : `${baseURL}${banner.image_path}`,
                }));
                setBanners(normalizedBanners);
            } else {
                setBanners([]);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách banner:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Không thể tải danh sách banner. Vui lòng thử lại sau.",
            });
        } finally {
            setLoading(false);
        }
    };

    const renderStatus = (status) => (status == "1" ? "Hiển thị" : "Ẩn");

    const handleEditClick = (id) => {
        navigate(`/admin/banner/edit/${id}`);
    };

    const handleDeleteClick = async (banner) => {
        const confirmDelete = await Swal.fire({
            title: `Bạn có chắc chắn muốn xóa banner không?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Có",
            cancelButtonText: "Không",
        });

        if (confirmDelete.isConfirmed) {
            try {
                await deleteBanner(banner.id);
                Swal.fire("Thành công", "Xóa banner thành công.", "success");
                fetchBanners();
            } catch (error) {
                console.error("Lỗi khi xóa banner:", error);
                Swal.fire("Lỗi", "Không thể xóa banner. Vui lòng thử lại.", "error");
            }
        }
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(banners.length / bannersPerPage)) {
            setCurrentPage(page);
        }
    };

    return (
        <div
            className={
                "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
                (color === "light" ? "bg-white" : "bg-lightBlue-900 text-white")
            }
        >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex justify-between items-center">
                    <h3
                        className={
                            "font-bold text-2xl text-lg " +
                            (color === "light" ? "text-blueGray-700" : "text-white")
                        }
                        style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                    >
                        - DANH SÁCH BANNER -
                    </h3>
                    <NavLink
                        to="/admin/banner/add"
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none"
                    >
                        THÊM BANNER
                    </NavLink>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15} />
                </div>
            ) : (
                <div className="block w-full overflow-x-auto">
                    <table className="items-center w-full bg-transparent border-collapse">
                        <thead>
                        <tr>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">STT</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Hình ảnh</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Trạng thái</th>
                            <th className="px-6 py-3 border border-solid text-center uppercase font-semibol">Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayedBanners.length > 0 ? (
                            displayedBanners.map((banner, index) => (
                                <tr key={banner.id}>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4">{index + 1}</td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4">
                                        <img
                                            src={banner.image_path}
                                            alt={banner.name}
                                            className="w-16 h-16 object-cover"
                                        />
                                    </td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4">{renderStatus(banner.status)}</td>
                                    <td className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4">
                                        <button
                                            className="text-blue-500 hover:text-blue-700 px-2"
                                            onClick={() => handleEditClick(banner.id)}
                                        >
                                            <i className="fas fa-pen text-xl"></i>
                                        </button>
                                        <button
                                            className="text-red-500 hover:text-red-700 ml-2 px-2"
                                            onClick={() => handleDeleteClick(banner)}
                                        >
                                            <i className="fas fa-trash text-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    Không có banner nào.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Phân trang */}
            <div className="flex justify-center items-center mt-4 mb-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed mx-2"
                >
                    <FontAwesomeIcon icon={faChevronLeft} />
                </button>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(banners.length / bannersPerPage)}
                    className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg disabled:bg-gray-300 disabled:cursor-not-allowed mx-2"
                >
                    <FontAwesomeIcon icon={faChevronRight} />
                </button>
            </div>
        </div>
    );
}

Banner.defaultProps = {
    color: "light",
};

Banner.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
