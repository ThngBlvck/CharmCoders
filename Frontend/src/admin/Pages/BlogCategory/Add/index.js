import React from "react";
import { useForm } from "react-hook-form";
import { postBlogCategory } from "../../../../services/BlogCategory";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddBlogCategory({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (!data.categoryName.trim()) {
            toast.error('Tên danh mục không được bỏ trống.');
            return;
        }

        if (!data.status) {
            toast.error('Vui lòng chọn trạng thái.');
            return;
        }

        try {
            await postBlogCategory({
                name: data.categoryName,
                status: data.status,
            });

            toast.success('Thêm danh mục blog thành công.');
            reset();
            navigate('/admin/category_blog');

        } catch (err) {
            console.error('Error adding blog category:', err);
            toast.error('Lỗi khi thêm danh mục blog. Vui lòng thử lại.');
        }
    };

    return (
        <>
            <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
                                THÊM DANH MỤC BLOG
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tên danh mục</label>
                            <input
                                type="text"
                                {...register("categoryName", { required: "Tên danh mục là bắt buộc" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập tên danh mục"
                            />
                            {errors.categoryName && <p className="text-red-500 text-xs italic">{errors.categoryName.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                            <select
                                {...register("status", { required: "Vui lòng chọn trạng thái" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn trạng thái</option>
                                <option value="1">Hiển thị</option>
                                <option value="2">Ẩn</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-xs italic">{errors.status.message}</p>}
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang thêm..." : "Thêm danh mục"}
                            </button>
                            <button
                                type="button"
                                className={`bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => navigate('/admin/category_blog')}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

AddBlogCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
