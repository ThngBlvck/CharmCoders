import request from '../../api';

const URL_Product = 'admin/products';
const URL_Search = 'admin/product/search';  // Thay đổi URL nếu cần
const URL_Checkout = 'client/buy-now';
const URL_MomoPayment = 'momo-payment';


// Hàm tìm kiếm sản phẩm
export const searchProduct = (query) => {
    return request({
        method: 'GET',
        path: `${URL_Search}?query=${query}`,
    });
};

// Hàm lấy danh sách sản phẩm
export const getProduct = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Product}`,
        params: {
            query: query  // Truyền từ khóa tìm kiếm vào query parameters
        }
    });
};

// Hàm lấy thông tin 1 sản phẩm
export const getOneProduct = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Product}/${id}`
    });
};

// Hàm lấy danh sách sản phẩm theo ID
export const getProductsByIds = (ids) => {
    return request({
        method: 'GET',
        path: `${URL_Product}?ids=${ids.join(',')}` // Gửi danh sách các id dưới dạng query string
    });
};

// Hàm thêm mới sản phẩm
export const postProduct = (data) => {
    return request({
        method: 'POST',
        path: `${URL_Product}`,
        data
    });
};

// Hàm cập nhật sản phẩm
export const updateProduct = (id, data) => {
    return request({
        method: 'POST',
        path: `${URL_Product}/${id}?_method=PUT`,
        data
    });
};

// Hàm xóa sản phẩm
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

// Hàm lấy sản phẩm liên quan
export const getRelatedProducts = (id) => {
    return request({
        method: 'GET',
        path: `client/products/related/${id}`, // Đường dẫn tương ứng với API route
    });
};


// Hàm lấy danh sách sản phẩm hot nhất
export const getHotProducts = () => {
    return request({
        method: 'GET',
        path: 'client/products/hot', // Đường dẫn API từ route
    });
};
