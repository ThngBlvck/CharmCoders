import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { getOrderById, updateOrder } from "../../../../services/Order"; // Adjust to your actual service
import Swal from "sweetalert2";

export default function EditOrderStatus() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            status: "",
        },
    });

    useEffect(() => {
        fetchOrderData(id);
    }, [id]);

    const fetchOrderData = async (id) => {
        try {
            const result = await getOrderById(id);
            if (result) {
                setValue("status", result.status);
            } else {
                Swal.fire("Lỗi", "Không tìm thấy đơn hàng này.", "error");
                navigate("/admin/order");
            }
        } catch (err) {
            console.error("Error fetching order data:", err);
            Swal.fire("Lỗi", "Lỗi khi tải đơn hàng. Vui lòng thử lại.", "error");
            navigate("/admin/order");
        }
    };

    const onSubmit = async (data) => {
        try {
            const updatedData = { status: parseInt(data.status) }; // Ensure the status is sent as an integer
            await updateOrder(id, updatedData);
            Swal.fire("Thành công", "Cập nhật trạng thái đơn hàng thành công.", "success").then(() => {
                navigate("/admin/order");
            });
        } catch (err) {
            console.error("Error updating order status:", err);
            Swal.fire("Lỗi", "Lỗi khi cập nhật trạng thái đơn hàng. Vui lòng thử lại.", "error");
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex items-center">
                    <h3
                        className="font-bold text-2xl text-blueGray-700"
                        style={{ fontFamily: "Roboto, sans-serif" }}
                    >
                        CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
                    </h3>
                </div>
            </div>

            <div className="block w-full overflow-x-auto px-4 py-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-blueGray-600 text-sm font-bold mb-2">
                            Trạng thái đơn hàng
                        </label>
                        <select
                            {...register("status", { required: "Vui lòng chọn trạng thái đơn hàng" })}
                            className="border border-solid px-3 py-2 rounded text-blueGray-600 w-full"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="0">Đang chờ xác nhận</option>
                            <option value="1">Đang chuẩn bị hàng</option>
                            <option value="2">Đang giao</option>
                            <option value="3">Đã nhận hàng</option>
                            <option value="4">Đã hủy</option>
                        </select>
                        {errors.status && (
                            <p className="text-red-500 text-xs italic">{errors.status.message}</p>
                        )}
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
                            onClick={() => navigate("/admin/order")}
                        >
                            Hủy bỏ
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
