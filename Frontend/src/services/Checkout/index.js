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


export const vnPayCheckout = async (cartItemIds, address, paymentMethod) => {
    console.log(cartItemIds); // Add this line to check the data

    // Validate required parameters
    if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
        throw new Error("cartItemIds must be a non-empty array.");
    }
    if (!address) {
        throw new Error("Address is required.");
    }
    if (!paymentMethod) {
        throw new Error("Payment method is required.");
    }

    try {
        // Make the POST request to the VNPay checkout endpoint
        const response = await request({
            method: 'POST',
            path: `${URL_Vnpay}`, // Ensure the correct API path here
            data: {
                cart_item_ids: cartItemIds, // List of cart item IDs
                address, // Delivery address
                paymentMethod // Payment method (e.g., VNPay, MoMo)
            },
        });

        // Assuming the API returns a `url` field if successful
        if (response && response.url) {
            return { url: response.url }; // Return the payment URL
        } else {
            throw new Error("Failed to generate VNPay payment URL.");
        }
    } catch (error) {
        // Handle any errors (e.g., network issues, API errors)
        console.error("Error in VNPay checkout:", error);
        throw new Error("An error occurred while processing the payment.");
    }
};



