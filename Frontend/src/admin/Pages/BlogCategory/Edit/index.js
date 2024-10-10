import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getOneBlogCategory, updateBlogCategory } from '../../../../services/BlogCategory'; // Adjust the path based on your folder structure
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BlogCategoryEdit() {
    const { id } = useParams(); // Get the category ID from the URL
    const [categoryData, setCategoryData] = useState({
        name: '',
        status: '',
    });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCategoryData(id);
    }, [id]);

    const fetchCategoryData = async (id) => {
        try {
            const result = await getOneBlogCategory(id); // Fetch category data by ID
            setCategoryData({
                name: result.name || '',
                status: result.status || '',
            });
        } catch (err) {
            console.error('Error fetching category data:', err);
            toast.error('Lỗi khi tải danh mục. Vui lòng thử lại.');
        }
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCategoryData({
            ...categoryData,
            [name]: value,
        });
    };

    // Handle form submission
    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateBlogCategory(id, categoryData); // Use categoryData instead of data
            toast.success('Cập nhật danh mục blog thành công.');
            navigate('/admin/category_blog'); // Redirect back to the category list
        } catch (err) {
            console.error('Error updating category:', err);
            toast.error('Lỗi khi cập nhật danh mục. Vui lòng thử lại.');
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-blueGray-700">
                        Chỉnh sửa danh mục bài viết
                    </h3>
                </div>
            </div>

            <div className="block w-full overflow-x-auto px-4 py-4">
                <form onSubmit={handleFormSubmit}>
                    {/* Category Name */}
                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={categoryData.name}
                            onChange={handleInputChange}
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                            required
                        />
                    </div>

                    {/* Category Status */}
                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Trạng thái
                        </label>
                        <select
                            name="status"
                            value={categoryData.status}
                            onChange={handleInputChange}
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                            required
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Hiển thị</option>
                            <option value="2">Ẩn</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                        >
                            Cập nhật
                        </button>
                        <button
                            type="button"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => navigate('/admin/category_blog')}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>

            {/* Toast Container for messages */}
            <ToastContainer />
        </div>
    );
}
