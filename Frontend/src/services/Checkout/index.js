import request from '../../api'; // Import your custom request function

const URL_Checkout = 'client/orders';
const URL_Vnpay  = 'client/checkout'; // Adjusted to reflect the correct endpoint
const URL_getAllCart  = 'client/getAllCart';
// Checkout function for order data
export const checkout = (orderData) => {
    return request({
        method: 'POST',
        path: `${URL_Checkout}`,
        data: orderData, // Send the entire order information
    });
};


    export const vnPayCheckout = (cartItemIds, address, paymentMethod) => {
        return request({
            method: 'POST',
            path: `${URL_Vnpay}`,
            data: {
                cart_item_ids: cartItemIds, // Send the cart item IDs
                address: address, // Include the address
                payment_method: paymentMethod // Include the payment method
            },
        });
    };

