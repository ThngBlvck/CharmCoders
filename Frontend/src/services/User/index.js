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



