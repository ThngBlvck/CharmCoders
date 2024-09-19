import request from '../../api';

export const getBrand = () => {
    return request({
        method: 'GET',
        path: 'brands'
    });
};

export const getOneBrand = (id) => {
    return request({
        method: 'GET',
        path: `brands/${id}`
    });
};

export const postBrand = (data) => {
    return request({
        method: 'POST',
        path: 'brands',
        data
    });
};

export const updateBrand = (id, data) => {
    return request({
        method: 'PUT',
        path: `brands/${id}`,
        data
    });
};

export const deleteBrand = (id) => {
    return request({
        method: 'DELETE',
        path: `brands/${id}`
    });
};
