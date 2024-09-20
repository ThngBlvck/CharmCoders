import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { postCategory } from "../../../../services/Category";
import Swal from 'sweetalert2';

export default function AddProductCategory({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            console.log("Dữ liệu gửi đi:", data);

            const response = await postCategory({
                name: data.name,
                status: data.status,
            });

            console.log("Phản hồi từ API:", response);
            Swal.fire({
                icon: 'success',
                title: 'Thêm danh mục thành công!',
                confirmButtonText: 'OK'
            });
            reset();
            navigate('/admin/category_product');

        } catch (error) {
            console.error("Có lỗi xảy ra khi thêm danh mục:", error);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: error.message || "Lỗi không xác định",
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div
            className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
        >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
                            THÊM DANH MỤC SẢN PHẨM
                        </h3>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Tên danh mục */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tên danh mục</label>
                        <input
                            type="text"
                            {...register("name", { required: "Tên danh mục là bắt buộc" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập tên danh mục"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                        <select
                            {...register("status", { required: "Vui lòng chọn trạng thái" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Hiện</option>
                            <option value="0">Ẩn</option>
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
        </div>
    );
}

AddProductCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
