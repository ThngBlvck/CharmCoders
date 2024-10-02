import request from '../../api';

const Ad = 'admin/';

export const getRole = () => {
    return request({
        method: 'GET',
        path: `${Ad}role`
    });
};

export const getOneRole = (id) => {
    return request({
        method: 'GET',
        path: `${Ad}role/${id}`
    });
};

export const postRole = (data) => {
    return request({
        method: 'POST',
        path: `${Ad}role`,
        data
    });
};

export const updateRole = (id, data) => {
    return request({
        method: 'PUT',
        path: `${Ad}role/${id}`,
        data
    });
};

export const deleteRole = (id) => {
    return request({
        method: 'DELETE',
        path: `${Ad}role/${id}`
    });
};
