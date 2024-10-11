import request from '../../api';

const URL_Cart = 'client/carts'

export const addToCart = async (userId, productId, quantity) => {
    const response = await fetch(`${URL_Cart}`, {
        method: 'POST',
        body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            quantity: quantity,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to add to cart');
    }

    return await response.json();
};
