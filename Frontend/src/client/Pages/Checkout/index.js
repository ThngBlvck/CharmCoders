import React, { useEffect, useState } from "react";
import {useLocation, useParams} from "react-router-dom";
import {makeMomoPayment} from '../../../services/Product'; // Import service
import { getCartById } from '../../../services/Cart';
import "../../../assets/styles/css/bootstrap.min.css";
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Checkout() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        address: "",
        phone: "",
        paymentMethod: "cashOnDelivery",
    });
    const { id } = useParams();
    const [product, setProduct] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    useEffect(() => {
        const cartIds = queryParams.get('cartIds')?.split(',') || [];
        if (cartIds.length > 0) {
            fetchCartById(cartIds);
        }
    }, [location.search]);

    const fetchCartById = async (cartIds) => {
        try {
            const result = await getCartById(cartIds);
            console.log("Kết quả từ API:", result); // Log kết quả để kiểm tra
            setProduct(Array.isArray(result) ? result : []); // Đảm bảo setProduct luôn nhận mảng
        } catch (error) {
            console.error("Lỗi khi lấy sản phẩm:", error);
            setProduct([]); // Đặt thành mảng rỗng nếu có lỗi
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Thông tin thanh toán:", formData);

        if (formData.paymentMethod === "momo") {
            handleMomoPayment();
        } else {
            // Xử lý các phương thức thanh toán khác
            console.log("Thông tin thanh toán:", formData);
        }
    };

    const handleMomoPayment = async () => {
        try {
            const amount = calculateTotal();
            const response = await makeMomoPayment(amount, `order_${Date.now()}`, "Thanh toán đơn hàng #1234");
            if (response && response.payUrl) {
                window.location.href = response.payUrl; // Chuyển tới URL thanh toán MoMo
            } else {
                console.error("Lỗi thanh toán MoMo: không có URL thanh toán");
            }
        } catch (error) {
            console.error('Lỗi thanh toán MoMo:', error);
        }
    };

    const calculateTotal = () => {
        if (!Array.isArray(product) || product.length === 0) {
            return 0; // Trả về 0 nếu không phải là mảng hoặc mảng rỗng
        }
        return product.reduce((total, item) => total + item.price * item.quantity, 0);
    };


    return (
        <div className="container py-5">
            <div className="row">
                {/* Kiểm tra trạng thái đăng nhập */}
                    <>
                        {/* Hiển thị sản phẩm */}
                        <div className="col-md-6">
                            <p className="mb-4 font-semibold" style={{color: "#8c5e58", fontSize: "30px"}}>Sản phẩm của
                                bạn</p>
                            <div className="list-group">
                                {Array.isArray(product) && product.length > 0 ? (
                                    product.map(item => (
                                        <div key={item.id}
                                             className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img src={item.image} alt={item.name} className="img-thumbnail me-3"
                                                     style={{width: "100px", height: "100px"}}/>
                                                <div>
                                                    <p style={{color: "#8c5e58"}}>{item.name}</p>
                                                    <p className="mb-0"
                                                       style={{color: "#8c5e58"}}>{item.price.toLocaleString("vi-VN")} VND
                                                        x {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có sản phẩm nào.</p>
                                )}
                            </div>

                            <p className="mt-4 font-semibold"
                               style={{color: "#8c5e58"}}>Tổng: {calculateTotal().toLocaleString("vi-VN")} VND</p>
                        </div>

                        {/* Form thông tin người dùng */}
                        <div className="col-md-6">
                            <p className="mb-4 font-semibold" style={{color: "#8c5e58", fontSize: "30px"}}>Thông tin
                                thanh toán</p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Họ và
                                        Tên</label>
                                    <input
                                        type="text"
                                        className="form-control rounded"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label font-semibold" style={{ color: "#8c5e58" }}>Email</label>
                                    <input
                                        type="email"
                                        className="form-control rounded"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label font-semibold" style={{ color: "#8c5e58" }}>Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control rounded"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label font-semibold" style={{ color: "#8c5e58" }}>Địa chỉ</label>
                                    <input
                                        type="text"
                                        className="form-control rounded"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                {/* Phương thức thanh toán với icon */}
                                <div className="mb-4">
                                    <label className="form-label font-semibold" style={{ color: "#8c5e58" }}>Phương thức thanh toán</label>
                                    <div className="d-flex">
                                        <div className="form-check me-3">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="cashOnDelivery"
                                                checked={formData.paymentMethod === "cashOnDelivery"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" style={{ color: "#8c5e58" }}>
                                                <i className="fas fa-money-bill fa-2x"></i> Thanh toán khi nhận hàng
                                            </label>
                                        </div>
                                        <div className="form-check me-3">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="momo"
                                                checked={formData.paymentMethod === "momo"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" style={{ color: "#8c5e58" }}>
                                                <i className="fab fa-gg-circle fa-2x"></i> Momo
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="creditCard"
                                                checked={formData.paymentMethod === "creditCard"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" style={{ color: "#8c5e58" }}>
                                                <i className="fas fa-credit-card fa-2x"></i> Credit card
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary">Xác nhận thanh toán</button>
                            </form>
                        </div>
                    </>
            </div>
        </div>
    );
}
