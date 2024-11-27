import React, {useState} from "react";
import { useForm } from "react-hook-form";
import { postBlogCategory } from "../../../../services/BlogCategory"; // Import the service
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from 'sweetalert2'; // Thêm thư viện sweetalert2
import {PulseLoader} from "react-spinners"; // Hàm lấy danh sách danh mục

export default function AddBlogCategory({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate(); // Initialize hook useNavigate
    const [loading, setLoading] = useState(true); // Thêm state loading

    const onSubmit = async (data) => {
        if (!data.categoryName.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Tên danh mục không được bỏ trống.',
            });
            return;
        }

        if (!data.status) {
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Vui lòng chọn trạng thái.',
            });
            return;
        }
        setLoading(true);
        try {
            await postBlogCategory({
                name: data.categoryName,
                status: data.status,
            });

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Thêm danh mục blog thành công.',
            });

            reset(); // Xóa dữ liệu form sau khi thành công
            navigate('/admin/category_blog'); // Chuyển hướng về trang danh mục blog

        } catch (err) {
            console.error('Error adding blog category:', err);
            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Lỗi khi thêm danh mục blog. Vui lòng thử lại.',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
        >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={
                            "font-bold text-2xl text-lg " +
                            (color === "light" ? "text-blueGray-700" : "text-white")
                        } style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                        >
                            THÊM DANH MỤC BÀI VIẾT
                        </h3>
                    </div>
                </div>
            </div>
            {isSubmitting ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={true} size={15} />
                </div>
            ) : (
                <div className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Tên danh mục */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tên danh mục</label>
                            <input
                                type="text"
                                {...register("categoryName", { required: "Tên danh mục là bắt buộc" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập tên danh mục"
                            />
                            {errors.categoryName && (
                                <p className="text-red-500 text-xs italic">{errors.categoryName.message}</p>
                            )}
                        </div>

                        {/* Trạng thái */}
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

                        {/* Nút thêm */}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang thêm..." : "Thêm danh mục"}
                            </button>
                        </div>
                    </form>
                </div>
            )}


        </div>
    );
}

AddBlogCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
