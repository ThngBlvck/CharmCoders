import request from '../../api';

const URL_Address = 'client/address';

export const postAddress = (data) => {
    return request({
        method: 'POST',
        path: `${URL_Address}`,
        data
    });
};

export const getAddress = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Address}`,
    });
};

export const getAddressById = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Address}/${id}`,
    });
};

export const updateAddress = (id, data) => {
    return request({
        method: 'POST',
        path: `${URL_Address}/${id}?_method=PUT`,
        data
    });
};

export const deleteAddress = (id) => {
    return request({
        method: 'DELETE',
        path: `${URL_Address}/${id}`
    });
};