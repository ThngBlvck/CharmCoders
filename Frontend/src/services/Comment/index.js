import request from '../../api';
import axios from 'axios';

const URL_Post = 'admin/blog';
const URL_Search = 'admin/search';  // Change URL if needed
const URL_Comments = 'client/comments'; // Ensure this matches your API
const URL_User = "client/users";
const URL_Product = 'admin/product';
// Fetch a user by ID
export const getUser = async (id) => {
    return request({
        method: 'GET',
        path: `${URL_User}/${id}`,
    });
};

// Fetch comments for a specific product ID
export const getCommentsByBlogId = async (blogId) => {
    return request({
        method: 'GET',
        path: `client/comments/blog/${blogId}`, // Update path to match the new route
    });
};


export const addComment = async (data) => {
    try {
        const response = await request({
            method: 'POST',
            path: URL_Comments,
            data,
        });
        console.log('Add Comment response:', response);  // Log response here
        return response;
    } catch (error) {
        console.error('Error in addComment:', error);  // Log any error in the addComment request
        throw error;  // Re-throw the error so it can be caught in the calling function
    }
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

// Function to get one product by ID
export const getOneProduct = (id) => {
    return request({
        method: 'GET',
        path: `${URL_Product}/${id}`,
    });
};

// Function to get all products with optional query
export const getPost = (query = '') => {
    return request({
        method: 'GET',
        path: `${URL_Post}`,
        params: {
            query: query,  // Pass search query as query parameters
        },
    });
};


// Function to get product names and associated user_name
export const getBlogWithUserNames = async () => {
    try {
        // Lấy danh sách các bài viết từ API
        const blogs = await getPost();

        // Kiểm tra nếu dữ liệu không phải là mảng
        if (!Array.isArray(blogs)) {
            throw new Error('Dữ liệu không phải là một mảng.');
        }

        // Chuyển mảng bài viết thành mảng các đối tượng chứa tên bài viết và tên người dùng
        return blogs.map(blog => {
            // Kiểm tra xem blog có đủ dữ liệu cần thiết không
            const blogTitle = blog.title || 'Không có tiêu đề';
            const user_name = blog.user_name && blog.user_name ? blog.user_name : 'Người dùng không xác định';

            return {
                blogTitle: blogTitle,  // Tiêu đề bài viết
                user_name: user_name,    // Tên tác giả
            };
        });
    } catch (error) {
        console.error('Lỗi khi lấy danh sách bài viết với tên người dùng:', error.message);
        throw error;  // Ném lại lỗi sau khi đã ghi log
    }
};
