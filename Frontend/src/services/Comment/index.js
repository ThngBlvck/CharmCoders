import request from '../../api';
import axios from 'axios';

const URL_Product = 'admin/products';
const URL_Search = 'admin/search';  // Change URL if needed
const URL_Comments = 'client/comments'; // Ensure this matches your API
const URL_User = "client/users";

// Fetch a user by ID
export const getUser = async (id) => {
    return request({
        method: 'GET',
        path: `${URL_User}/${id}`,
    });
};

// Fetch comments for a specific product ID
export const getCommentsByProductId = async (productId) => {
    return request({
        method: 'GET',
        path: `client/comments/product/${productId}`, // Update path to match the new route
    });
};

export const addComment = async (data) => {
    return request({
        method: 'POST',
        path: URL_Comments,
        data,
    });
};

// Fetch all comments
export const getComments = async () => {
    return request({
        method: 'GET',
        path: URL_Comments,
    });
};

// Delete a comment by ID
export const deleteComment = async (commentId) => {
    return request({
        method: 'DELETE',
        path: `${URL_Comments}/${commentId}`, // Ensure this matches your API route
    });
};

// Function to search for products
export const searchProduct = (query) => {
    return request({
        method: 'GET',
        path: `${URL_Search}?query=${query}`,
    });
};

// Function to get all products with optional query
export const getProduct = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Product}`,
        params: {
            query: query,  // Pass search query as query parameters
        },
    });
};

// Function to get one product by ID
export const getOneProduct = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Product}/${id}`,
    });
};

// Function to post a new product
export const postProduct = (data) => {
    return request({
        method: 'POST',
        path: `${URL_Product}`,
        data,
    });
};

// Function to update a product by ID
export const updateProduct = (id, data) => {
    return request({
        method: 'POST',
        path: `${URL_Product}/${id}?_method=PUT`,
        data,
    });
};

// Function to delete a product by ID
export const deleteProduct = (id) => {
    return request({
        method: 'DELETE',
        path: `${URL_Product}/${id}`,
    });
};

// Function to get product names and associated user names
export const getProductWithUserNames = async () => {
    try {
        const products = await getProduct();
        // Assuming each product has a 'name' and a 'user' object with 'name' property
        return products.map(product => ({
            productName: product.name,
            userName: product.user ? product.user.name : 'Unknown User',  // Handle case where user might not be defined
        }));
    } catch (error) {
        console.error('Failed to fetch products with user names', error);
        throw error;  // Re-throw error after logging
    }
};
