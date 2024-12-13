import request from '../../api';

const URL_Messages = 'client'; // Địa chỉ API của bạn

// Gửi tin nhắn
export const sendMessage = (data) => {
    return request({
        method: 'POST',
        path: `${URL_Messages}/send-message`,
        data
    });
};

// Lấy danh sách tin nhắn giữa người dùng
export const getMessages = (receiverId) => {
    return request({
        method: 'GET',
        path: `${URL_Messages}/messages/${receiverId}`,
    });
};

export const getListSender = () => {
    return request({
        method: 'GET',
        path: `admin/users-messages`,
    });
};

export const adminSendMessage = (data) => {
    return request({
        method: 'POST',
        path: `admin/send-message`,
    });
};
