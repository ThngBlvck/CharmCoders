import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postBrand } from "../../../../services/Brand";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2'; // Import SweetAlert2
import 'react-toastify/dist/ReactToastify.css';
import { PulseLoader } from 'react-spinners'; // Import PulseLoader từ react-spinners

export default function AddBrand({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Thêm state loading

    const onSubmit = async (data) => {
        if (!data.brandName.trim()) {
            Swal.fire('Lỗi', 'Tên nhãn hàng không được bỏ trống.', 'error');
            return;
        }

        if (!data.image[0]) {
            Swal.fire('Lỗi', 'Vui lòng chọn hình ảnh.', 'error');
            return;
        }

        // Set the status to 1 (Hiển thị) by default
        data.status = 1;

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", data.brandName);
            formData.append("status", data.status);
            formData.append("image", data.image[0]);

            await postBrand(formData);

            Swal.fire('Thành công', 'Thêm nhãn hàng thành công.', 'success').then(() => {
                reset();
                navigate('/admin/brand');
            });

        } catch (err) {
            console.error('Error adding brand:', err);
            Swal.fire('Lỗi', 'Lỗi khi thêm nhãn hàng. Vui lòng thử lại.', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className="font-bold text-2xl text-blueGray-700"
                                style={{ fontFamily: "Roboto, sans-serif" }}>
                                THÊM NHÃN HÀNG
                            </h3>
                        </div>
                    </div>
                </div>
                {isSubmitting ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15} />
                    </div>
                ) : (
                    <div className="p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Tên nhãn hàng</label>
                                <input
                                    type="text"
                                    {...register("brandName", { required: "Tên nhãn hàng là bắt buộc" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nhập tên nhãn hàng"
                                />
                                {errors.brandName &&
                                    <p className="text-red-500 text-xs italic">{errors.brandName.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh nhãn hàng</label>
                                <input
                                    type="file"
                                    {...register("image", { required: "Vui lòng chọn hình ảnh" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    accept="image/*"
                                />
                                {errors.image && <p className="text-red-500 text-xs italic">{errors.image.message}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang thêm..." : "Thêm nhãn hàng"}
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
            </div>
            <ToastContainer />
        </>
    );
}

AddBrand.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
