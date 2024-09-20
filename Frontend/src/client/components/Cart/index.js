import React, {createContext, useState, useContext} from 'react';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState([]);

    const addItemToCart = (item) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(i => i.id === item.id);
            if (existingItem) {
                return prevCart.map(i => i.id === item.id ? {...i, quantity: i.quantity + 1} : i);
            }
            return [...prevCart, item];
        });
    };

    const removeItemFromCart = (itemId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const incrementQuantity = (itemId) => {
        setCart((prevCart) =>
            prevCart.map(item => item.id === itemId ? {...item, quantity: item.quantity + 1} : item)
        );
    };

    const decrementQuantity = (itemId) => {
        setCart((prevCart) =>
            prevCart.map(item => item.id === itemId ? {...item, quantity: Math.max(1, item.quantity - 1)} : item)
        );
    };

    return (
        <CartContext.Provider
            value={{cart, addItemToCart, removeItemFromCart, clearCart, incrementQuantity, decrementQuantity}}>
            {children}
        </CartContext.Provider>
    );
};
