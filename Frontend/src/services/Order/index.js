import request from '../../api';

const URL_Order = 'client/orders';
const URL_Order_Admin = 'admin/orders';
const URL_Update_Order = 'admin/orders';
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
        path: `${URL_Order}${id}`,

    });
};
export const getOrderAdmin = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Order_Admin}`,
    });
};

export const updateOrder = (id, status) => {
    return request({
        method: 'POST',
        path: `${URL_Update_Order}/${id}?_method=PUT`,
        data: {
            status: status, // Truyền status là chuỗi thay vì đối tượng
        },
    });
};