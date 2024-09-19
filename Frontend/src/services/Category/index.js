import request from '../../api';

export const getCategory = () => {
    return request({
        method: 'GET',
        path: 'categories'
    });
};

export const getOneCategory = (id) => {
    return request({
        method: 'GET',
        path: `categories/${id}`
    });
};

export const postCategory = (data) => {
    return request({
        method: 'POST',
        path: 'categories',
        data
    });
};

export const updateCategory = (id, data) => {
    return request({
        method: 'PUT',
        path: `categories/${id}`,
        data
    });
};

export const deleteCategory = (id) => {
    return request({
        method: 'DELETE',
        path: `categories/${id}`
    });
};
