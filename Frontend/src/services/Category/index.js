import request from '../../api';

const URL_Categoty = 'admin/categories'

export const getCategory = () => {
    return request({
        method: 'GET',
        path: `${URL_Categoty}`,
    });
};

export const getOneCategory = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Categoty}/${id}`
    });
};

export const postCategory = (data) => {
    return request({
        method: 'POST',
        path: `${URL_Categoty}`,
        data
    });
};

export const updateCategory = (id, data) => {
    return request({
        method: 'PUT',
        path: `${URL_Categoty}/${id}`,
        data
    });
};

export const deleteCategory = (id) => {
    return request({
        method: 'DELETE',
        path: `${URL_Categoty}/${id}`
    });
};
