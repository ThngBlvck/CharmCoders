import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

export default function AddProductCategory({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate(); // Khởi tạo hook useNavigate

    const onSubmit = async (data) => {
        console.log(data); // Gửi dữ liệu lên server

        // Giả sử bạn đã có một hàm gửi dữ liệu lên server ở đây
        // await sendDataToServer(data);

        reset(); // Xóa form sau khi submit thành công

        // Chuyển hướng sau khi thêm thành công
        navigate('/admin/category_product');
    };

    return (
        <>
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
                                {...register("categoryName", { required: "Tên danh mục là bắt buộc" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập tên danh mục"
                            />
                            {errors.categoryName && <p className="text-red-500 text-xs italic">{errors.categoryName.message}</p>}
                        </div>

                        {/* Trạng thái */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                            <select
                                {...register("status", { required: "Vui lòng chọn trạng thái" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="pending">Chờ duyệt</option>
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
        </>
    );
}

AddProductCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
