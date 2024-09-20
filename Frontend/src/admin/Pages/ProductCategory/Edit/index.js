import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { getOneCategory, updateCategory } from "../../../../services/Category";
import Swal from 'sweetalert2';

export default function EditProductCategory({ color = "light" }) {
    const { id } = useParams(); // Lấy id danh mục từ URL
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        reset,
    } = useForm();

    const navigate = useNavigate();

    // Tải dữ liệu danh mục hiện tại khi component được mount
    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await getOneCategory(id);
                console.log("Phản hồi từ API:", response);

                if (response && response.name && response.status !== undefined) {
                    setValue("name", response.name);
                    setValue("status", response.status === 1 ? "1" : "0"); // Chuyển đổi status về dạng chuỗi
                } else {
                    console.error("Dữ liệu trả về từ API không hợp lệ");
                    navigate("/admin/category_product");
                }
            } catch (error) {
                console.error("Lỗi khi tải danh mục:", error);
                navigate("/admin/category_product");
            }
        };

        fetchCategory();
    }, [id, setValue, navigate]);

    // Xử lý submit form
    const onSubmit = async (data) => {
        try {
            const response = await updateCategory(id, {
                name: data.name,
                status: data.status,
            });

            console.log("Cập nhật danh mục thành công:", response);
            Swal.fire({
                icon: 'success',
                title: 'Cập nhật thành công!',
                text: 'Danh mục đã được cập nhật.',
                confirmButtonText: 'OK'
            });
            reset();
            navigate("/admin/category_product");
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật danh mục:", error);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: error.message || "Lỗi không xác định",
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
                            SỬA DANH MỤC SẢN PHẨM
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

                    {/* Nút sửa */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật danh mục"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditProductCategory.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
