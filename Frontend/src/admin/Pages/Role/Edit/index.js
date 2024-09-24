import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, watch } from "react-hook-form";
import Swal from 'sweetalert2';
import { getOneRole, updateRole } from '../../../../services/Role'; // Giả sử bạn có dịch vụ này

export default function RoleEdit() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting }, watch } = useForm({
        defaultValues: {
            name: '',
            status: '',
        },
    });

    useEffect(() => {
        fetchRoleData(id);
    }, [id]);

    const fetchRoleData = async (id) => {
        try {
            const result = await getOneRole(id); // Gọi API để lấy thông tin Role
            if (result) {
                setValue("name", result.name || '');
                setValue("status", result.status || '');
            } else {
                Swal.fire('Error', 'Không tìm thấy vai trò này.', 'error');
                navigate('/admin/role'); // Điều hướng đến trang danh sách Role
            }
        } catch (err) {
            console.error('Error fetching role data:', err);
            Swal.fire('Error', 'Lỗi khi tải vai trò. Vui lòng thử lại.', 'error');
            navigate('/admin/role'); // Điều hướng đến trang danh sách Role
        }
    };

    const onSubmit = async (data) => {
        try {
            await updateRole(id, {
                name: data.name,
                status: data.status,
            });
            Swal.fire('Success', 'Cập nhật vai trò thành công.', 'success');
            navigate('/admin/role'); // Điều hướng đến trang danh sách Role
        } catch (err) {
            console.error('Error updating role:', err);
            Swal.fire('Error', 'Lỗi khi cập nhật vai trò. Vui lòng thử lại.', 'error');
        }
        console.log('Dữ liệu gửi đi:', { name: data.name, status: data.status });
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex items-center">
                    <h3 className="font-semibold text-lg text-blueGray-700">
                        Chỉnh sửa vai trò
                    </h3>
                </div>
            </div>

            <div className="block w-full overflow-x-auto px-4 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Tên vai trò
                        </label>
                        <input
                            type="text"
                            {...register("name", { required: "Tên vai trò là bắt buộc" })}
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                            placeholder="Nhập tên vai trò"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Trạng thái
                        </label>
                        <select
                            {...register("status", { required: "Vui lòng chọn trạng thái" })}
                            value={watch("status")} // Đồng bộ giá trị status
                            onChange={(e) => setValue("status", e.target.value)} // Cập nhật giá trị khi thay đổi
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Hoạt động</option>
                            <option value="0">Vô hiệu hóa</option>
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
                            onClick={() => navigate('/admin/role')}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
