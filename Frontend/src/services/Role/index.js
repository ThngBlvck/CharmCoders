import request from '../../api';


export const getRole = () => {
    return request({
        method: 'GET',
        path: 'role'
    });
};

export const getOneRole = (id) => {
    return request({
        method: 'GET',
        path: `role/${id}`
    });
};

export const postRole = (data) => {
    return request({
        method: 'POST',
        path: 'role',
        data
    });
};

export const updateRole = (id, data) => {
    return request({
        method: 'PUT',
        path: `role/${id}`,
        data
    });
};

export const deleteRole = (id) => {
    return request({
        method: 'DELETE',
        path: `role/${id}`
    });
};
