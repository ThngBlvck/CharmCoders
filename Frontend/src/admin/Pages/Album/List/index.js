import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getImage, deleteImage } from '../../../../services/Alblum'; // Đảm bảo đường dẫn đúng
import { getOneProduct } from '../../../../services/Product'; // API lấy thông tin sản phẩm
import Swal from 'sweetalert2';
import { PulseLoader } from "react-spinners";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Album({ color }) {
    const [images, setImages] = useState([]);
    const [productNames, setProductNames] = useState({});
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const imagesPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
    const [displayedImages, setDisplayedImages] = useState([]);
    const navigate = useNavigate(); // Sử dụng để chuyển hướng

    useEffect(() => {
        fetchImages();
    }, [searchTerm]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * imagesPerPage;
        const endIndex = startIndex + imagesPerPage;
        setDisplayedImages(images.slice(startIndex, endIndex));
    }, [currentPage, images]);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const result = await getImage();

            const productIds = [...new Set(result.map((img) => img.product_id))];
            const productData = await Promise.all(
                productIds.map((id) => getOneProduct(id))
            );

            const namesMap = productData.reduce((acc, prod) => {
                acc[prod.id] = prod.name;
                return acc;
            }, {});

            setImages(result);
            setProductNames(namesMap);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách hình ảnh sản phẩm:", error);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Lỗi khi tải danh sách hình ảnh sản phẩm. Vui lòng thử lại sau."
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = async (image) => {
        const confirm = await Swal.fire({
            title: "Bạn có chắc muốn xóa hình ảnh này?",
            text: "Thao tác này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
        });

        if (confirm.isConfirmed) {
            try {
                await deleteImage(image.id);
                Swal.fire({
                    icon: "success",
                    title: "Đã xóa",
                    text: "Hình ảnh đã được xóa thành công.",
                });
                fetchImages(); // Cập nhật danh sách
            } catch (error) {
                console.error("Lỗi khi xóa hình ảnh:", error);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Không thể xóa hình ảnh. Vui lòng thử lại sau.",
                });
            }
        }
    };

    const handleEditClick = (id) => {
        navigate(`/admin/album/edit/${id}`);
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(images.length / imagesPerPage)) {
            setCurrentPage(page);
        }
    };

    const getPaginationPages = (currentPage, totalPages) => {
        const maxVisiblePages = 3;
        const pages = [];
        if (totalPages <= maxVisiblePages + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (currentPage > 3) {
                pages.push("...");
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (currentPage < totalPages - 2) {
                pages.push("...");
            }
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
                                style={{ fontFamily: 'Roboto, sans-serif' }}
                            >
                                - DANH SÁCH HÌNH ẢNH SẢN PHẨM -
                            </h3>
                        </div>
                        <NavLink
                            to={`/admin/album/add`}
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                            type="button"
                        >
                            Thêm Album
                        </NavLink>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4f46e5" />
                    </div>
                ) : (
                    <div className="px-4 py-4 flex flex-col">
                        <table className="table-auto w-full border-collapse">
                            <thead>
                            <tr>
                                <th className={"px-6 py-3 border border-solid text-center uppercase font-semibol"}
                                    style={{width: "10%"}}
                                >STT
                                </th>
                                <th className="w-16 px-2 py-2 border border-solid text-center uppercase font-semibold">
                                    Tên Sản Phẩm
                                </th>
                                <th className="w-16 px-2 py-2 border border-solid text-center uppercase font-semibold">
                                    Hình Ảnh
                                </th>
                                <th className="w-16 px-2 py-2 border border-solid text-center uppercase font-semibold">
                                    Hành Động
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {displayedImages.length > 0 ? (
                                displayedImages.map((image, index) => (
                                    <tr key={image.id}>
                                        <th className="border-t-0 px-6 align-middle text-x text-center whitespace-nowrap p-4">
                                        <span className="ml-3 font-bold">
                                            {index + 1}
                                        </span>
                                        </th>
                                        <td className="border-t-0 px-6 align-middle text-xs text-center whitespace-nowrap p-4">
                                            <span
                                                className="text-xl">{productNames[image.product_id] || "Đang tải..."}</span>
                                        </td>

                                        <td className="border-t-0 px-6 align-middle text-xs text-center whitespace-nowrap p-4">
                                            <img
                                                src={image.image}
                                                className="w-20 h-20 object-cover"
                                                alt="Product"
                                            />
                                        </td>
                                        <td className="border-t-0 px-6 align-middle text-xs text-center whitespace-nowrap p-4">
                                            <button
                                                className="text-blue-500 hover:text-blue-700 px-2"
                                                onClick={() => handleEditClick(image.id)}
                                            >
                                                <i className="fas fa-pen text-xl"></i>
                                            </button>
                                            <button
                                                className="text-red-500 hover:text-red-700 ml-2 px-2"
                                                onClick={() => handleDeleteClick(image)}
                                            >
                                                <i className="fas fa-trash text-xl"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        Không có hình ảnh nào.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>

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
                                {getPaginationPages(currentPage, Math.ceil(images.length / imagesPerPage)).map((page, index) =>
                                        page === "..." ? (
                                            <span
                                                key={`ellipsis-${index}`}
                                                className="w-10 h-10 flex items-center justify-center text-gray-500"
                                            >...</span>
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
                                disabled={currentPage === Math.ceil(images.length / imagesPerPage)}
                                className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                            >
                                <FontAwesomeIcon icon={faChevronRight}/>
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </>
    );
}

Album.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};

Album.defaultProps = {
    color: "light",
};
