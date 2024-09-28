import request from '../../api';

export const login = async (credentials) => {
    try {
        const response = await request({
            method: 'POST',
            path: 'login',
            data: credentials,
        });
        return response; // Đảm bảo trả về response đúng
    } catch (error) {
        throw error; // Ném lỗi để frontend có thể xử lý
    }
};

