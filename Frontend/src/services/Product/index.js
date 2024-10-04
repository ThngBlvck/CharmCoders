import request from '../../api';

const URL_Product = 'admin/products';

const URL_Search = 'admin/search';  // Thay đổi URL nếu cần

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
