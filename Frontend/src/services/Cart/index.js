import request from '../../api';

const URL_Cart = 'admin/cart';
const URL_CartId = 'client/checkout-buy-now';

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

export const getCartById = (id) => {
    return request({
        method: 'POST',
        path: `${URL_CartId}/${id}`,
    });
};
