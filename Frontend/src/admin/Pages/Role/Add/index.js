import React from "react";
import { useForm } from "react-hook-form";
import { postRole } from "../../../../services/Role"; // Assuming you have a service for Role
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from 'sweetalert2';

export default function AddRole({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        if (!data.roleName.trim()) {
            Swal.fire('Error', 'Tên vai trò không được bỏ trống.', 'error');
            return;
        }

        if (!data.status) {
            Swal.fire('Error', 'Vui lòng chọn trạng thái.', 'error');
            return;
        }

        try {
            await postRole({
                name: data.roleName,
                status: data.status,
            });

            Swal.fire('Thành công!', 'Thêm vai trò thành công.', 'success');
            reset();
            navigate('/admin/role');
        } catch (err) {
            console.error('Error adding role:', err);
            Swal.fire('Lỗi', 'Lỗi khi thêm vai trò. Vui lòng thử lại.', 'error');
        }
    };

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-bold text-2xl text-blueGray-700"
                            style={{ fontFamily: "Roboto, sans-serif" }}>
                            THÊM VAI TRÒ
                        </h3>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Tên vai trò */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tên vai trò</label>
                        <input
                            type="text"
                            {...register("roleName", { required: "Tên vai trò là bắt buộc" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập tên vai trò"
                        />
                        {errors.roleName && <p className="text-red-500 text-xs italic">{errors.roleName.message}</p>}
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                        <select
                            {...register("status", { required: "Vui lòng chọn trạng thái" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Hoạt động</option>
                            <option value="0">Vô hiệu hóa</option>
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
                            {isSubmitting ? "Đang thêm..." : "Thêm vai trò"}
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

AddRole.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
