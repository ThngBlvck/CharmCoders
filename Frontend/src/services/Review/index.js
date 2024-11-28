import request from '../../api'; // Assuming you're using axios or similar library
const URL_Review = 'client/review';
const URL_ReviewA = 'admin/review'; // Update this with the correct API path for reviews
const URL_Reviews = 'client/reviews';
const URL_Review1 = 'client/review1';

export const getReviews = async (product_id) => {
    return request({
        method: 'GET',
        path: `${URL_Review1}/${product_id}`,  // Đường dẫn API để lấy đánh giá theo product_id
    });
};


export const getReviewsAdmin = async () => {
    return request({
        method: 'GET',
        path: `${URL_ReviewA}`,
    });
};

export const addReview = async (reviewData) => {
    return request({
        method: 'POST',
        path: URL_Review,  // Đường dẫn API để lưu đánh giá
        data: reviewData,  // Dữ liệu đánh giá (rating, comment, product_id, v.v.)
    });
};

// Cập nhật đánh giá
export const updateReview = async (reviewId, reviewData) => {
    return request({
        method: 'PUT',
        path: `${URL_Review}/${reviewId}`,  // Đường dẫn API để cập nhật đánh giá
        data: reviewData,  // Dữ liệu cập nhật
    });
};


export const getReviewById = async (reviewId) => {
    console.log("Fetching review with ID:", reviewId);  // Log the reviewId

    return request({
        method: 'GET',
        path: `client/reviews/${reviewId}`,
    });
};



