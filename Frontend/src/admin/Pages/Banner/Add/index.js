import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { postBanner } from "../../../../services/Banner";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { PulseLoader } from 'react-spinners';

export default function AddBanner({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]); // Lưu danh sách các hình ảnh đã chọn

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages(files);
    };

    const onSubmit = async (data) => {
        if (!data.status) {
            Swal.fire('Lỗi', 'Vui lòng chọn trạng thái.', 'error');
            return;
        }

        if (!selectedImages.length) {
            Swal.fire('Lỗi', 'Vui lòng chọn ít nhất một hình ảnh.', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("status", data.status);

            // Lặp qua tất cả các hình ảnh đã chọn và thêm vào FormData
            selectedImages.forEach((file) => {
                formData.append("images[]", file);
            });

            await postBanner(formData);

            Swal.fire('Thành công', 'Thêm banner thành công.', 'success').then(() => {
                reset();
                setSelectedImages([]);
                navigate('/admin/banner');
            });

        } catch (err) {
            console.error('Error adding banner:', err);
            Swal.fire('Lỗi', 'Lỗi khi thêm banner. Vui lòng thử lại.', 'error');
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
                            <h3 className={
                                "font-bold text-2xl text-lg " +
                                (color === "light" ? "text-blueGray-700" : "text-white")
                            } style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                            >
                                THÊM BANNER
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
                                <label className="block text-gray-700 text-sm font-bold mb-2">Hình nền</label>
                                <input
                                    type="file"
                                    {...register("image_path")}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageChange}
                                />
                                {errors.image_path && <p className="text-red-500 text-xs italic">{errors.image_path.message}</p>}
                            </div>

                            {/* Xem trước danh sách các hình ảnh đã chọn */}
                            {selectedImages.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh đã chọn:</label>
                                    <div className="flex flex-wrap gap-4">
                                        {selectedImages.map((image, index) => (
                                            <div key={index} className="w-20 h-20 border rounded overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`selected-${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                                <select
                                    {...register("status", { required: "Vui lòng chọn trạng thái" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value="1">Hiển thị</option>
                                    <option value="2">Ẩn</option>
                                </select>
                                {errors.status &&
                                    <p className="text-red-500 text-xs italic">{errors.status.message}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? "Đang thêm..." : "Thêm banner"}
                                </button>
                                <button
                                    type="button"
                                    className={`bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    onClick={() => navigate('/admin/banner')}
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

AddBanner.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
