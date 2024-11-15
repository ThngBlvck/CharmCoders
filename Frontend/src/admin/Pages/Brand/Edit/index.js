import React, {useEffect, useState} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getOneBrand, updateBrand } from '../../../../services/Brand'; // Adjust to your actual service
import Swal from 'sweetalert2'; // Import SweetAlert2
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners

export default function EditBrand() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            brandName: '',
            status: '',
            image: null,
        },
    });

    const [loading, setLoading] = useState(true); // Thêm state loading

    useEffect(() => {
        fetchBrandData(id);
    }, [id]);

    const fetchBrandData = async (id) => {
        setLoading(true)
        try {
            const result = await getOneBrand(id); // Fetch the brand by ID
            if (result) {
                setValue("brandName", result.name || '');
                setValue("status", result.status || '');

            } else {
                Swal.fire('Lỗi', 'Không tìm thấy nhãn hàng này.', 'error');
                navigate('/admin/brand');
            }
        } catch (err) {
            console.error('Error fetching brand data:', err);
            Swal.fire('Lỗi', 'Lỗi khi tải nhãn hàng. Vui lòng thử lại.', 'error');
            navigate('/admin/brand');
        } finally {
            setLoading(false)
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("name", data.brandName);
            formData.append("status", data.status);
            formData.append("_method", "PUT");

            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]); // Append the new image if selected
            }

            await updateBrand(id, formData); // Update the brand with the ID
            Swal.fire('Thành công', 'Cập nhật nhãn hàng thành công.', 'success').then(() => {
                navigate('/admin/brand');
            });
        } catch (err) {
            console.error('Error updating brand:', err);
            Swal.fire('Lỗi', 'Lỗi khi cập nhật nhãn hàng. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-blueGray-700">
                        Chỉnh sửa nhãn hàng
                    </h3>
                </div>
            </div>
            { loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            ) : (
                <div className="block w-full overflow-x-auto px-4 py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-4">
                            <label className="block text-blueGray-600 text-sm font-bold mb-2">
                                Tên nhãn hàng
                            </label>
                            <input
                                type="text"
                                {...register("brandName", {required: "Tên nhãn hàng là bắt buộc"})}
                                className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                                placeholder="Nhập tên nhãn hàng"
                            />
                            {errors.brandName &&
                                <p className="text-red-500 text-xs italic">{errors.brandName.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-blueGray-600 text-sm font-bold mb-2">
                                Hình ảnh nhãn hàng
                            </label>
                            <input
                                type="file"
                                {...register("image")}
                                className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                                accept="image/*"
                            />
                            {errors.image && <p className="text-red-500 text-xs italic">{errors.image.message}</p>}
                        </div>

                        <div className="mb-4">
                            <label className="block text-blueGray-600 text-sm font-bold mb-2">
                                Trạng thái
                            </label>
                            <select
                                {...register("status", {required: "Vui lòng chọn trạng thái"})}
                                className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
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
                                className={`bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                            </button>
                            <button
                                type="button"
                                className={`bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                onClick={() => navigate('/admin/brand')}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </form>
                </div>
            )}
            {/* Remove ToastContainer as we are using SweetAlert2 */}
        </div>
    );
}
