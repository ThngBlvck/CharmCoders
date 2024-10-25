import request from '../../api';

const URL_Cart = 'admin/cart';
const URL_CartId = 'client/getCart';

export const addToCart = (productId, quantity) => {
    return request({
        method: 'POST',
        path: `${URL_Cart}`, // Sửa từ `path` thành `url`
        data: { // Sử dụng `data` thay vì `body`
            product_id: productId,
            quantity: quantity,
        },
    });
};

export const getCart = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Cart}`,
    });
};

export const deleteCart = (id) => {
    return request({
        method: 'DELETE',
        path: `${URL_Cart}/${id}`
    });
};

export const getCartsByIds = (ids) => {
    const idsParam = ids.join(','); // nối các id thành một chuỗi, ngăn cách bằng dấu phẩy
    return request({
        method: 'GET',
        path: `${URL_CartId}?ids=${idsParam}`, // truyền chuỗi các id vào query parameter
    });
};
