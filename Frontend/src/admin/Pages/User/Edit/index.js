import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { getOneUser, updateUser } from "../../../../services/User";
import { getRole } from "../../../../services/Role";
import Swal from "sweetalert2";

export default function EditEmployee({ color = "light" }) {
    const { id } = useParams();
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm();
    const navigate = useNavigate();
    const [roles, setRoles] = useState([]);
    const [isPasswordMasked, setIsPasswordMasked] = useState(true); // Quản lý trạng thái hiển thị mật khẩu
    const [employee, setEmployee] = useState({
        name: '',
        email: '',
        password: '', // Mật khẩu được mã hóa từ backend
        phone: '',
        address: '',
        role_id: '',
    });
    const [originalPassword, setOriginalPassword] = useState(""); // Lưu mật khẩu gốc

    // Lấy thông tin nhân viên ban đầu
    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await getOneUser(id);
                if (response.success) {
                    setEmployee(response.user);
                    setOriginalPassword(response.user.password); // Lưu lại mật khẩu gốc
                    setValue("name", response.user.name);
                    setValue("email", response.user.email);
                    setValue("phone", response.user.phone);
                    setValue("address", response.user.address);
                    setValue("role_id", response.user.role_id);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin nhân viên:", error);
            }
        };

        fetchEmployee();
    }, [id, setValue]);

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
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("password", data.password || originalPassword); // Nếu mật khẩu mới rỗng, sử dụng mật khẩu gốc
            formData.append("phone", data.phone);
            formData.append("address", data.address);
            formData.append("role_id", data.role_id);

            if (data.image && data.image[0]) {
                formData.append("image", data.image[0]);
            }

            const response = await updateUser(id, formData);
            console.log(response)
            Swal.fire({
                icon: "success",
                title: "Cập nhật nhân viên thành công!",
                confirmButtonText: "OK",
            });
            navigate("/admin/user");
        } catch (error) {
            console.error("Có lỗi xảy ra khi cập nhật nhân viên:", error);
            Swal.fire({
                icon: "error",
                title: "Có lỗi xảy ra",
                text: error.message || "Lỗi không xác định",
                confirmButtonText: "OK",
            });
        }
    };

    return (
        <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-bold text-2xl text-blueGray-700"
                            style={{ fontFamily: "Roboto, sans-serif" }}>CẬP NHẬT NHÂN VIÊN</h3>
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
                            {...register("name", { required: "Tên là bắt buộc" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập tên nhân viên"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>

                    {/* Mật khẩu */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Mật khẩu</label>
                        <div className="relative">
                            <input
                                type={isPasswordMasked ? "password" : "text"}
                                {...register("password")}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập mật khẩu mới nếu muốn thay đổi"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: "Email là bắt buộc" })}
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
                            {...register("phone", { required: "Số điện thoại là bắt buộc" })}
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
                            {...register("address", { required: "Địa chỉ là bắt buộc" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập địa chỉ"
                        />
                        {errors.address && <p className="text-red-500 text-xs italic">{errors.address.message}</p>}
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh (Tùy chọn)</label>
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
                            {...register("role_id", { required: "Vui lòng chọn quyền" })}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn quyền</option>
                            {roles
                                .filter(role => role.id === 3 || role.id === 2) // Chỉ lọc quyền admin và nhân viên
                                .map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                        </select>
                        {errors.role_id && <p className="text-red-500 text-xs italic">{errors.role_id.message}</p>}
                    </div>

                    {/* Nút cập nhật */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật nhân viên"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditEmployee.propTypes = {
    color: PropTypes.string,
};
