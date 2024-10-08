import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { getOneBlogCategory, updateBlogCategory } from '../../../../services/BlogCategory';

export default function BlogCategoryEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            name: '',
            status: '',
        },
    });

    useEffect(() => {
        fetchCategoryData(id);
    }, [id]);

    const fetchCategoryData = async (id) => {
        try {
            const result = await getOneBlogCategory(id);
            if (result) {
                setValue("name", result.name || '');
                setValue("status", result.status || '');
            } else {
                Swal.fire('Error', 'Không tìm thấy danh mục này.', 'error');
                navigate('/admin/category_blog');
            }
        } catch (err) {
            console.error('Error fetching category data:', err);
            Swal.fire('Error', 'Lỗi khi tải danh mục. Vui lòng thử lại.', 'error');
            navigate('/admin/category_blog');
        }
    };

    const onSubmit = async (data) => {
        try {
            await updateBlogCategory(id, {
                name: data.name,
                status: data.status,
            });
            Swal.fire('Success', 'Cập nhật danh mục bài viết thành công.', 'success');
            navigate('/admin/category_blog');
        } catch (err) {
            console.error('Error updating category:', err);
            Swal.fire('Error', 'Lỗi khi cập nhật danh mục. Vui lòng thử lại.', 'error');
        }
        console.log('Dữ liệu gửi đi:', { name: data.name, status: data.status });
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
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Tên danh mục
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Tên danh mục là bắt buộc" })}
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                            placeholder="Nhập tên danh mục"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Trạng thái
                        </label>
                        <select
                            {...register("status", { required: "Vui lòng chọn trạng thái" })}
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Hiển thị</option>
                            <option value="0">Ẩn</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-xs italic">{errors.status.message}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
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
    );
}
