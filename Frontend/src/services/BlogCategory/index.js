import request from '../../api';

export const getBlogCategory = () => {
    return request({
        method: 'GET',
        path: 'blogcategory'
    });
};

export const getOneBlogCategory = (id) => {
    return request({
        method: 'GET',
        path: `blogcategory/${id}`
    });
};

export const postBlogCategory = (data) => {
    return request({
        method: 'POST',
        path: 'blogcategory',
        data
    });
};

export const updateBlogCategory = (id, data) => {
    return request({
        method: 'PUT',
        path: `blogcategory/${id}`,
        data
    });
};

export const deleteBlogCategory = (id) => {
    return request({
        method: 'DELETE',
        path: `blogcategory/${id}`
    });
};
