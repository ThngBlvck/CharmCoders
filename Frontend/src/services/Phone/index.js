import request from '../../api';

const URL_SendOtp = 'client/send-otp';
const URL_VerifyOtp = 'client/verify-otp';

export const sendOtp = (data) => {
    return request({
        method: 'POST',
        path: `${URL_SendOtp}`,
        data
    });
};

export const verifyOtp = (data) => {
    return request({
        method: 'POST',
        path: `${URL_VerifyOtp}`,
        data
    });
};



