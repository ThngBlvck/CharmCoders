import request from '../../api';

export const getBrand = () => {
    return request({
        method: 'GET',
        path: 'admin/brands'
    });
};

export const getOneBrand = (id) => {
    return request({
        method: 'GET',
        path: `admin/brands/${id}`
    });
};

export const postBrand = (data) => {
    return request({
        method: 'POST',
        path: 'admin/brands',
        data
    });
};

export const updateBrand = (id, data) => {
    return request({
        method: 'POST',
        path: `admin/brands/${id}`,
        data
    });
};

export const deleteBrand = (id) => {
    return request({
        method: 'DELETE',
        path: `admin/brands/${id}`
    });
};
