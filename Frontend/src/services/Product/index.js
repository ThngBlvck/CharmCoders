import request from '../../api';

const URL_Product = 'admin/products'

export const getProduct = () => {
    return request({
        method: 'GET',
        path: `${URL_Product}`
    });
};

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
