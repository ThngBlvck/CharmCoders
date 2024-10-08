import request from '../../api';

const Ad = 'admin/'
export const getComment = () => {
    return request({
        method: 'GET',
        path: `${Ad}comment`
    });
};

export const getOneComment = (id) => {
    return request({
        method: 'GET',
        path: `${Ad}comment/${id}`
    });
};

// export const postComment = (data) => {
//     return request({
//         method: 'POST',
//         path: `${Ad}brands`,
//         data
//     });
// };
//
// export const updateComment = (id, data) => {
//     return request({
//         method: 'POST',
//         path: `${Ad}brands/${id}`,
//         data
//     });
// };

export const deleteComment = (id) => {
    return request({
        method: 'DELETE',
        path: `${Ad}comment/${id}`
    });
};
