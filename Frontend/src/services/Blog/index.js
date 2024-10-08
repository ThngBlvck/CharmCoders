import request from '../../api';

const Ad = 'admin/'
export const getBlog = () => {
    return request({
        method: 'GET',
        path: `${Ad}blog`
    });
};

export const getOneBlog = (id) => {
    return request({
        method: 'GET',
        path: `${Ad}blog/${id}`
    });
};

export const postBlog = (data) => {
    return request({
        method: 'POST',
        path: `${Ad}blog`,
        data
    });
};
export const updateBlog = (id, data) => {
    return request({
        method: 'POST',
        path: `${Ad}blog/${id}?_method=put`,
        data
    });
};

export const deleteBlog = (id) => {
    return request({
        method: 'DELETE',
        path: `${Ad}blog/${id}`
    });
};
