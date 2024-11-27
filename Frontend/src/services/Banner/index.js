import request from '../../api';

const URL_Search = 'admin/banner/search';
const Ad = 'admin/'
export const getBanner = () => {
    return request({
        method: 'GET',
        path: `${Ad}banners`,
    });
};

export const getOneBanner = (id) => {
    return request({
        method: 'GET',
        path: `${Ad}banners/${id}`
    });
};

export const postBanner = (data) => {
    return request({
        method: 'POST',
        path: `${Ad}banners`,
        data
    });
};
export const updateBanner = (id, data) => {
    return request({
        method: 'POST',
        path: `${Ad}banners/${id}`,
        data
    });
};

export const deleteBanner = (id) => {
    return request({
        method: 'DELETE',
        path: `${Ad}banners/${id}`
    });
};
// Hàm tìm kiếm nhãn hàng
export const searchbanner = (query) => {
    return request({
        method: 'GET',
        path: `${URL_Search}?query=${query}`,
    });
};