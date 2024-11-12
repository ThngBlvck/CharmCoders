import request from '../../api';
import axios from "axios";

const URL_Checkout = 'client/orders';
const URL_Momo_Checkout = 'http://localhost:8000/api/client/payment/momo';


export const checkout = (orderData) => {
    return request({
        method: 'POST',
        path: `${URL_Checkout}`,
        data: orderData, // Gửi toàn bộ thông tin đơn hàng
    });
};


export const momoCheckout = async (orderData) => {
    try {
        const response = await axios.post(URL_Momo_Checkout, orderData);
        if (response.data.resultCode === 0) {
            // Nếu thanh toán thành công, trả về URL thanh toán MoMo
            return response.data.payUrl; // hoặc response.data nếu bạn muốn lấy các dữ liệu khác
        } else {
            throw new Error('Thanh toán không thành công');
        }
    } catch (error) {
        console.error('Có lỗi xảy ra trong quá trình thanh toán:', error);
        throw error;
    }
};
