import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderByIdAd } from "../../../../services/Order";
import { getProductsByIds } from "../../../../services/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faSpinner } from "@fortawesome/free-solid-svg-icons"; // Import faSpinner

export default function OrderDetail() {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null); // State to hold order data
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrderDetails();
    }, [id]);

    const fetchOrderDetails = async () => {
        try {
            const result = await getOrderByIdAd(id);
            setOrderData(result.data); // Accessing 'data' directly from the API response
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white px-6 py-6">
            {orderData ? (
                <div className="bg-white shadow-md rounded-lg p-6 flex">
                    {/* Left side: User and Order Information */}
                    <div className="w-1/2 pr-6">
                        <h3 className="text-2xl font-semibold mb-4">Chi Tiết Đơn Hàng: #{orderData.id}</h3>
                        {orderData.user && (
                            <div className="mb-4">
                                <h2 className="text-2xl font-semibold mb-4">Thông Tin Khách Hàng:</h2>
                                <p className="text-lg font-semibold mb-2">Tên Người Dùng: {orderData.user.name}</p>
                                <p className="text-lg font-semibold mb-2">Số Điện Thoại: {orderData.user.phone}</p>
                            </div>
                        )}
                        <p className="text-lg font-semibold mb-2">Địa chỉ: {orderData.address}</p>
                        <div className="mb-3">
                            <span className="text-lg font-semibold mb-2">Phương thức thanh toán: </span>
                            <span className="text-lg font-semibold mb-2">{orderData.payment_method === 1 ? 'Thanh toán khi nhận hàng' : orderData.payment_method === 2 ? 'Thanh toán chuyển khoản' : 'Không xác định'}</span>
                        </div>

                    </div>

                    {/* Right side: Product Information */}
                    <div className="w-1/2 pl-6">
                        <h4 className="text-xl font-semibold mt-6">Sản phẩm trong đơn hàng:</h4>
                        {orderData.details && orderData.details.length > 0 ? (
                            orderData.details.map((detail) => (
                                <div key={detail.id} className="flex items-center mt-4 border-b pb-4">
                                    <div className="w-2/3">
                                        <img
                                            src={detail.product.image}
                                            alt={detail.product.name}
                                            className="h-20 w-20 object-cover rounded"
                                        />
                                    </div>
                                    <div className="w-1/3 pl-4">
                                        <p className="text-lg font-semibold">Tên sản phẩm: {detail.product.name}</p>
                                        <p className="text-lg font-semibold">Số lượng: {detail.quantity}</p>
                                        <p className="text-lg font-semibold">Giá: {detail.price.toLocaleString()} VND</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có sản phẩm nào trong đơn hàng.</p>
                        )}

                        {/* Total Amount Section below the products */}
                        <p className="text-lg font-bold mt-6">
                            Tổng số tiền: {orderData.total_amount.toLocaleString()} VND
                        </p>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" /> {/* Spinner Icon */}
                    <p>Vui lòng chờ...</p>
                </div>
            )}

            {/* Quay lại button outside the order details */}
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
