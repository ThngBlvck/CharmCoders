import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { postUser} from "../../../../services/User";
import { getRole } from "../../../../services/Role";// Cập nhật để gọi API thêm nhân viên và lấy danh sách quyền
import Swal from 'sweetalert2';

export default function AddEmployee({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);

    // Lấy danh sách quyền từ API
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await getRole();
                setRoles(response);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách quyền:", error);
            }
        };

        fetchRoles();
    }, []);

    const onSubmit = async (data) => {
        try {
            console.log("Dữ liệu gửi đi:", data);

            const response = await postUser({
                name: data.name,
                email: data.email,
                phone: data.phone,
                address: data.address,
                role_id: data.role_id,
                password: data.password,
                image: data.image[0], // Dữ liệu hình ảnh sẽ lấy từ file input
            });


            console.log("Phản hồi từ API:", response);
            Swal.fire({
                icon: 'success',
                title: 'Thêm nhân viên thành công!',
                confirmButtonText: 'OK'
            });
            reset();
            navigate('/admin/user');

        } catch (error) {
            console.error("Có lỗi xảy ra khi thêm nhân viên:", error);
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
                        <h3 className="font-bold text-2xl text-blueGray-700"
                            style={{ fontFamily: "Roboto, sans-serif" }}>
                            THÊM NHÂN VIÊN
                        </h3>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Tên nhân viên */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tên</label>
                        <input
                            type="text"
                            {...register("name", {required: "Tên là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập tên nhân viên"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                        <input
                            type="password"
                            {...register("password", { required: "Mật khẩu là bắt buộc" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập mật khẩu"
                        />
                        {errors.password && <p className="text-red-500 text-xs italic">{errors.password.message}</p>}
                    </div>


                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email", {required: "Email là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập email"
                        />
                        {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message}</p>}
                    </div>

                    {/* Số điện thoại */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Số điện thoại</label>
                        <input
                            type="text"
                            {...register("phone", {required: "Số điện thoại là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && <p className="text-red-500 text-xs italic">{errors.phone.message}</p>}
                    </div>

                    {/* Địa chỉ */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Địa chỉ</label>
                        <input
                            type="text"
                            {...register("address", {required: "Địa chỉ là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập địa chỉ"
                        />
                        {errors.address && <p className="text-red-500 text-xs italic">{errors.address.message}</p>}
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh</label>
                        <input
                            type="file"
                            {...register("image")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Quyền người dùng */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Quyền</label>
                        <select
                            {...register("role_id", {required: "Vui lòng chọn quyền"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn quyền</option>
                            {roles
                                .filter(role => role.id === 3 || role.id === 2) // Lọc chỉ lấy quyền admin và nhân viên
                                .map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                        </select>
                        {errors.role_id && <p className="text-red-500 text-xs italic">{errors.role_id.message}</p>}
                    </div>


                    {/* Nút thêm */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang thêm..." : "Thêm nhân viên"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

AddEmployee.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
