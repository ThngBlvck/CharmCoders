import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { NavLink, useNavigate } from "react-router-dom";
import { getReviewsAdmin} from '../../../../services/Review';
import Swal from 'sweetalert2';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Reviews({ color }) {
    const [reviews, setReviews] = useState([]); // To hold reviews data
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true); // Loading state for fetching data
    const reviewsPerPage = 5; // Number of reviews per page
    const [displayedReviews, setDisplayedReviews] = useState([]); // Reviews to be displayed on the current page
    const [searchTerm, setSearchTerm] = useState(""); // Search term for filtering reviews

    const navigate = useNavigate();

    useEffect(() => {
        fetchReviews();
    }, [searchTerm]);

    useEffect(() => {
        const startIndex = (currentPage - 1) * reviewsPerPage;
        const endIndex = startIndex + reviewsPerPage;
        setDisplayedReviews(reviews.slice(startIndex, endIndex));
    }, [currentPage, reviews]);

    const fetchReviews = async () => {
        try {
            setLoading(true); // Start loading
            let result;

            if (searchTerm.trim() === "") {
                result = await getReviewsAdmin(); // Fetch all reviews if no search term
            } else {
                const sanitizedSearchTerm = removeVietnameseTones(searchTerm.trim()).toLowerCase(); // Remove accents and make lowercase
                console.log('Searching: ', sanitizedSearchTerm); // Log the search term
                result = await getReviewsAdmin(); // Fetch all reviews first

                // Filter reviews on the client-side based on the search term
                result = result.filter(review =>
                    removeVietnameseTones(review.user_name).toLowerCase().includes(sanitizedSearchTerm) ||
                    removeVietnameseTones(review.comment).toLowerCase().includes(sanitizedSearchTerm)
                );
            }

            console.log('Reviews: ', result); // Log the fetched reviews

            if (Array.isArray(result)) {
                setReviews(result); // Set reviews if the result is an array
            } else {
                setReviews([]); // Set an empty array if no valid result
            }
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]); // Set an empty array if there's an error
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "There was an error loading the reviews. Please try again later."
            });
        } finally {
            setLoading(false); // Stop loading
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

    const handlePageChange = (page) => {
        if (page > 0 && page <= Math.ceil(reviews.length / reviewsPerPage)) {
            setCurrentPage(page);
        }
    };

    const getPaginationPages = (currentPage, totalPages) => {
        const maxVisiblePages = 3; // Maximum visible pages
        const pages = [];

        if (totalPages <= maxVisiblePages + 2) {
            // If total pages are less, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show the first page
            pages.push(1);

            if (currentPage > 3) {
                // If current page is far from the first, add "..."
                pages.push("...");
            }

            // Show the current page and its neighbors
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                // If current page is far from the last, add "..."
                pages.push("...");
            }

            // Always show the last page
            pages.push(totalPages);
        }

        return pages;
    };

    const truncateComment = (comment) => {
        const words = comment.split(' '); // Chia comment thành mảng từ
        if (words.length > 30) {
            return words.slice(0, 30).join(' ') + '...'; // Chỉ lấy 30 từ đầu và thêm "..."
        }
        return comment; // Nếu comment có dưới 30 từ, hiển thị nguyên văn
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
                                - DANH SÁCH ĐÁNH GIÁ -
                            </h3>
                        </div>
                    </div>
                </div>
                {/* Input tìm kiếm sản phẩm */}
                <div className="mb-4 px-4">
                    <input
                        type="text"
                        className="border border-gray-300 rounded px-3 py-2 w-full shadow appearance-none focus:outline-none focus:shadow-outline"
                        placeholder="Tìm kiếm đánh giá..."
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
                                <th className="px-4 py-2 border text-xs uppercase font-semibold text-left"
                                    style={{width: '5%'}}>STT
                                </th>
                                <th className="px-4 py-2 border text-xs uppercase font-semibold text-left"
                                    style={{width: '10%'}}>Đánh giá
                                </th>
                                <th className="px-4 py-2 border text-xs uppercase font-semibold text-left"
                                    style={{width: '70%'}}>Nội dung
                                </th>
                                <th className="px-4 py-2 border text-xs uppercase font-semibold text-left"
                                    style={{width: '15%'}}>Người Đánh Giá
                                </th>

                            </tr>
                            </thead>
                            <tbody>
                            {displayedReviews.length > 0 ? (
                                displayedReviews.map((reviews, index) => (
                                    <tr key={reviews.id}>
                                        <th className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4 text-left flex items-center">
                        <span className="ml-3 font-bold">
                            {index + 1}
                        </span>
                                        </th>

                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {/* Render the star rating */}
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, starIndex) => (
                                                    <span
                                                        key={starIndex}
                                                        className={`text-yellow-500 ${starIndex < reviews.rating ? 'fas fa-star' : 'far fa-star'}`}
                                                    />
                                                ))}
                                            </div>
                                        </td>

                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {truncateComment(reviews.comment)}
                                        </td>


                                        <td className="border-t-0 px-6 align-middle text-xl whitespace-nowrap p-4">
                                            {reviews.user_name}
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
                        {getPaginationPages(currentPage, Math.ceil(reviews.length / reviewsPerPage)).map((page, index) =>
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
                        disabled={currentPage === Math.ceil(reviews.length / reviewsPerPage)}
                        className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full shadow hover:shadow-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition duration-200 mx-4"
                    >
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>
            </div>
        </>
    );
}

Reviews.defaultProps = {
    color: "light",
};

Reviews.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
