import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderByIdAd } from "../../../../services/Order";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import {PulseLoader} from "react-spinners";

export default function OrderDetail() {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [showAllProducts, setShowAllProducts] = useState(false); // State để điều khiển hiển thị sản phẩm
    const [loading, setLoading] = useState(true); // Thêm state loading
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const result = await getOrderByIdAd(id);
            setOrderData(result.data);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 rounded bg-white px-6 py-6">
            {loading ? (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15} />
                </div>
            ) : orderData ? (
                <div className="bg-white rounded-lg p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-3xl text-blueGray-700" style={{ fontFamily: "Roboto, sans-serif" }}>
                            Chi Tiết Đơn Hàng: #{orderData.id}
                        </h3>
                        {orderData.user && (
                            <div className="mt-4">
                                <h2 className="font-bold text-2xl text-blueGray-700" style={{ fontFamily: "Roboto, sans-serif" }}>Thông Tin Khách Hàng:</h2>
                                <p className="text-lg font-semibold mb-2">Tên Người Dùng: {orderData.user.name}</p>
                                <p className="text-lg font-semibold mb-2">Số Điện Thoại: {orderData.phone}</p>
                            </div>
                        )}
                        <p className="text-lg font-semibold mb-2">Địa chỉ: {orderData.address}</p>
                        <div className="mb-3">
                            <span className="text-lg font-semibold mb-2">Phương thức thanh toán: </span>
                            <span className="text-lg font-semibold mb-2">
                                {orderData.payment_method === 1
                                    ? "Thanh toán khi nhận hàng"
                                    : orderData.payment_method === 2
                                        ? "Thanh toán chuyển khoản"
                                        : "Không xác định"}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-2xl text-blueGray-700 mb-4" style={{ fontFamily: "Roboto, sans-serif" }}>
                            Sản phẩm trong đơn hàng:
                        </h4>
                        {orderData.details && orderData.details.length > 0 ? (
                            <>
                                {orderData.details
                                    .slice(0, showAllProducts ? orderData.details.length : 2)
                                    .map((detail) => (
                                        <div key={detail.id} className="flex items-center mt-4 border-b pb-4">
                                            <div className="w-20 h-20">
                                                <img
                                                    src={detail.product.image}
                                                    alt={detail.product.name}
                                                    className="h-full w-full object-cover rounded"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <p className="text-lg font-semibold">Tên sản phẩm: {detail.product.name}</p>
                                                <p className="text-lg font-semibold">Số lượng: {detail.quantity}</p>
                                                <p className="text-lg font-semibold">Giá: {detail.price.toLocaleString()} VND</p>
                                            </div>
                                        </div>
                                    ))}
                                {orderData.details.length > 2 && (
                                    <div className="mt-4 text-center">
                                        <button
                                            onClick={() => setShowAllProducts(!showAllProducts)}
                                            className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                                        >
                                            {showAllProducts ? "Thu gọn" : "Xem thêm"}
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>Không có sản phẩm nào trong đơn hàng.</p>
                        )}

                        <p className="text-lg font-bold mt-6">
                            Tổng số tiền: {orderData.total_amount.toLocaleString()} VND
                        </p>
                    </div>
                </div>
            ) : (
                <p>Không có dữ liệu đơn hàng.</p>
            )}

            <div className="mt-6 text-center">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
                >
                    Quay lại
                </button>
            </div>
        </div>
    );
}
