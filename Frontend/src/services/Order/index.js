import request from '../../api';

const URL_Order = 'client/orders';
const URL_Update_Order = 'admin/orders';
const URL_Order_Admin = 'admin/orders';
const URL_Search = 'admin/order/search';
export const getOrder = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Order}`,
        params: {
            query: query  // Truyền từ khóa tìm kiếm vào query parameters
        }
    });
};

export const getOrderById = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Order}/${id}`,
    });
};
export const getOrderByIdAd = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Order_Admin}/${id}`,
    });
};
export const updateOrder = (id, status, cancellationReason) => {
    return request({
        method: 'PUT',
        path: `${URL_Update_Order}/${id}`,
        data: {
            status: status, // Truyền status là chuỗi thay vì đối tượng
            cancellation_reason: cancellationReason || null
        },
    });
};
export const getOrderAdmin = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Order_Admin}`,
    });
};
// Hàm tìm kiếm đơn hàng
export const searchOrder = (query) => {
    return request({
        method: 'GET',
        path: `${URL_Search}?query=${query}`,
    });
};