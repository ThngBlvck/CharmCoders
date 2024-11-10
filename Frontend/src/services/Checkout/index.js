import request from '../../api'; // Import your custom request function

const URL_Checkout = 'client/orders';
const URL_Vnpay = 'client/checkout'; // Adjusted to reflect the correct endpoint
const URL_Return = 'client/payment-return'; // Adjusted to reflect the correct return endpoint

// Checkout function for order data
export const checkout = (orderData) => {
    return request({
        method: 'POST',
        path: `${URL_Checkout}`, // Ensure this is correctly mapped in your API
        data: orderData, // Send the entire order information
    }).catch(error => {
        console.error("Error during checkout:", error);
        throw new Error("Checkout failed. Please try again.");
    });
};

// VNPay Checkout function
export const vnPayCheckout = async (cartItemIds, address, paymentMethod) => {
    console.log("Cart Item IDs:", cartItemIds); // Debugging the data

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
                paymentMethod, // Payment method (e.g., VNPay, MoMo)
            },
        });

        // Assuming the API returns a `url` field if successful
        if (response && response.url) {
            return { url: response.url }; // Return the payment URL
        } else {
            throw new Error("Failed to generate VNPay payment URL.");
        }
    } catch (error) {
        console.error("Error in VNPay checkout:", error);
        throw new Error("An error occurred while processing the VNPay payment.");
    }
};

// Payment Return function (handles the callback from VNPay)
export const paymentReturn = async (txnRef, secureHash, status) => {
    // Validate required parameters
    if (!txnRef || !secureHash || !status) {
        throw new Error("All parameters (txnRef, secureHash, status) are required.");
    }

    try {
        // Build the query parameters for the GET request
        const queryParams = new URLSearchParams({
            vnp_TxnRef: txnRef,
            vnp_SecureHash: secureHash,
            vnp_TransactionStatus: status,
        });

        // Send a GET request to the backend with the necessary parameters
        const response = await request({
            method: 'GET',
            path: `${URL_Return}?${queryParams.toString()}`, // Add the query parameters to the URL
        });

        // Check the response and handle success or failure
        if (response && response.status === 'success') {
            return response; // Return the success response from the server
        } else {
            const errorMessage = response?.message || 'Payment verification failed. Please try again.';
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        throw new Error(`An error occurred while verifying the payment: ${error.message}`);
    }
};
