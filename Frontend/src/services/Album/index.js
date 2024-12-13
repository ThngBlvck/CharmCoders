import request from '../../api';

const Ad = 'admin/'
export const getImage = () => {
    return request({
        method: 'GET',
        path: `${Ad}image`
    });
};

export const getOneImage = (id) => {
    return request({
        method: 'GET',
        path: `${Ad}image/${id}`
    });
};

export const postImage = (data) => {
    return request({
        method: 'POST',
        path: `${Ad}image`,
        data
    });
};
export const updateImage = (id, data) => {
    return request({
        method: 'POST',
        path: `${Ad}image/${id}`,
        data
    });
};

export const deleteImage = (id) => {
    return request({
        method: 'DELETE',
        path: `${Ad}image/${id}`
    });
};

