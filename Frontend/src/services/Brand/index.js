import request from '../../api';

const Ad = 'admin/'
export const getBrand = () => {
    return request({
        method: 'GET',
        path: `${Ad}brands`
    });
};

export const getOneBrand = (id) => {
    return request({
        method: 'GET',
        path: `${Ad}brands/${id}`
    });
};

export const postBrand = (data) => {
    return request({
        method: 'POST',
        path: `${Ad}brands`,
        data
    });
};

export const updateBrand = (id, data) => {
    return request({
        method: 'POST',
        path: `${Ad}brands/${id}`,
        data
    });
};

export const deleteBrand = (id) => {
    return request({
        method: 'DELETE',
        path: `${Ad}brands/${id}`
    });
};
