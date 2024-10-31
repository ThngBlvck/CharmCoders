import request from '../../api';

const URL_Order = 'client/orders';

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