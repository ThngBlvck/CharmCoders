import request from '../../api';
const URL_User = "admin/users"

export const login = async (credentials) => {
    try {
        const response = await request({
            method: 'POST',
            path: 'login',
            data: credentials,
        });
        return response; 
    } catch (error) {
        throw error; 
    }
};

export const register = async (userData) => {
    try {
        const response = await request({
            method: 'POST',
            path: 'register',
            data: userData,
        });
        return response;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        // Lấy token từ localStorage
        const token = localStorage.getItem('token');
        console.log(token);
        
        // Kiểm tra xem token có tồn tại hay không
        if (!token) {
            throw new Error('Chưa có token để đăng xuất');
        }

        // Gửi yêu cầu đăng xuất
        const response = await request({
            method: 'POST',
            path: 'logout',
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token trong tiêu đề Authorization
                'Content-Type': 'application/json', 
            },
        });

        // Xóa token khỏi localStorage sau khi đăng xuất thành công
        localStorage.removeItem('token');

        return response;
    } catch (error) {
        console.log('Đăng xuất không thành công:', error); // Log lỗi để kiểm tra
        throw error; 
    }
};




