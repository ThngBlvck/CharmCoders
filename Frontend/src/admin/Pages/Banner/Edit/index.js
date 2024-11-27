import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { getOneBanner, updateBanner } from "../../../../services/Banner";
import { PulseLoader } from "react-spinners";

export default function EditBanner() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            status: "",
        },
    });

    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(null);

    useEffect(() => {
        fetchBannerData(id);
    }, [id]);

    const fetchBannerData = async (id) => {
        setLoading(true);
        try {
            const result = await getOneBanner(id);
            if (result) {
                setValue("status", result.status || ""); // Đặt giá trị trạng thái
                setCurrentImage(result.image); // Lưu URL ảnh hiện tại
            } else {
                Swal.fire("Lỗi", "Không tìm thấy banner này.", "error");
                navigate("/admin/banner");
            }
        } catch (err) {
            console.error("Error fetching banner data:", err);
            Swal.fire("Lỗi", "Lỗi khi tải banner. Vui lòng thử lại.", "error");
            navigate("/admin/banner");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            formData.append("status", data.status); // Thêm trạng thái
            formData.append("_method", "PUT");

            if (data.image?.[0]) {
                formData.append("image", data.image[0]); // Thêm file hình ảnh nếu có
            }

            await updateBanner(id, formData);
            Swal.fire("Thành công", "Cập nhật banner thành công.", "success").then(() => {
                navigate("/admin/banner");
            });
        } catch (err) {
            console.error("Error updating banner:", err);
            Swal.fire("Lỗi", "Lỗi khi cập nhật banner. Vui lòng thử lại.", "error");
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex items-center">
                    <h3 className="font-bold text-2xl text-blueGray-700">
                        CẬP NHẬT BANNER
                    </h3>
                </div>
            </div>
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15} />
                </div>
            ) : (
                <div className="block w-full overflow-x-auto px-4 py-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Trạng thái */}
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
                                <option value="2">Ẩn</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-xs italic">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label className="block text-blueGray-600 text-sm font-bold mb-2">
                                Hình ảnh mới
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                {...register("image")}
                                className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className={`bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 ${
                                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang cập nhật..." : "Cập nhật"}
                            </button>
                            <button
                                type="button"
                                className="bg-indigo-500 text-white active:bg-indigo-600 text-sm font-bold uppercase px-4 py-2 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                onClick={() => navigate("/admin/banner")}
                            >
                                Hủy bỏ
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
