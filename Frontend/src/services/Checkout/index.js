import request from '../../api';

const URL_Checkout = 'client/orders';

export const checkout = (orderData) => {
    return request({
        method: 'POST',
        path: `${URL_Checkout}`,
        data: orderData, // Gửi toàn bộ thông tin đơn hàng
    });
};
