import request from '../../api';

const URL_Product = 'admin/products';

const URL_Search = 'admin/search';  // Thay đổi URL nếu cần

const URL_Checkout = 'client/buy-now';
const URL_MomoPayment = 'momo-payment';

export const searchProduct = (query) => {
    return request({
        method: 'GET',
        path: `${URL_Search}?query=${query}`,
    });
};

export const getProduct = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Product}`,
        params: {
            query: query  // Truyền từ khóa tìm kiếm vào query parameters
        }
    });
};

// Các hàm CRUD khác không thay đổi
export const getOneProduct = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Product}/${id}`
    });
};

export const postProduct = (data) => {
    return request({
        method: 'POST',
        path: `${URL_Product}`,
        data
    });
};

export const updateProduct = (id, data) => {
    return request({
        method: 'POST',
        path: `${URL_Product}/${id}?_method=PUT`,
        data
    });
};

export const deleteProduct = (id) => {
    return request({
        method: 'DELETE',
        path: `${URL_Product}/${id}`
    });
};

// Hàm lấy thông tin checkout gồm product_id
export const getCheckoutData = (productId) => {
    return request({
        method: 'POST',
        path: `${URL_Checkout}`,
        data: { // Sử dụng `data` thay vì `body`
            product_id: productId,
        },
    });
};

// Hàm xử lý thanh toán qua MoMo
export const makeMomoPayment = (amount, orderId, orderInfo) => {
    return request({
        method: 'POST',
        path: `${URL_MomoPayment}`,
        data: {
            amount,       // Số tiền cần thanh toán
            orderId,      // ID của đơn hàng (có thể tự sinh hoặc từ backend)
            orderInfo     // Thông tin đơn hàng để hiển thị khi thanh toán
        }
    });
};