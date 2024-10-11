import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation } from "react-router-dom"; // Import useLocation để lấy thông tin từ URL
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
    const [products, setProducts] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Thêm trạng thái đăng nhập

    // Lấy productId từ URL
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('productId');

    const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts")) || [];
    if (productId) {
        // Đảm bảo rằng sản phẩm đã tải và tồn tại trong products
        const product = products.find(p => p.id === productId);
        if (product) {
            selectedProducts.push(product);
            localStorage.setItem("selectedProducts", JSON.stringify(selectedProducts));
        }
    }

    useEffect(() => {
        const userToken = localStorage.getItem("token"); // Kiểm tra token trong localStorage
        console.log("User Token:", userToken); // Kiểm tra giá trị token
        setIsLoggedIn(!!userToken); // Cập nhật trạng thái đăng nhập

        const selectedProducts = JSON.parse(localStorage.getItem("selectedProducts"));

        console.log("Product ID from URL:", productId);
        console.log("Selected Products from LocalStorage:", selectedProducts);

        if (productId) {
            const product = selectedProducts?.find(item => item.id === productId);
            if (product) {
                setProducts([product]); // Hiển thị sản phẩm đã chọn
            }
        } else {
            if (selectedProducts && selectedProducts.length > 0) {
                setProducts(selectedProducts); // Hiển thị tất cả sản phẩm đã chọn
            }
        }
    }, [productId]);

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
            const response = await axios.post('http://localhost:8000/momo-payment', {
                amount: calculateTotal(), // Tổng số tiền thanh toán
                orderId: `order_${Date.now()}`,
                orderInfo: "Thanh toán đơn hàng #1234",
            });

            // Chuyển hướng người dùng tới trang thanh toán MoMo
            window.location.href = response.data.payUrl;
        } catch (error) {
            console.error('Lỗi thanh toán MoMo:', error);
        }
    };

    // Tính tổng tiền
    const calculateTotal = () => {
        return products.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="container py-5">
            <div className="row">
                {/* Kiểm tra trạng thái đăng nhập */}
                {isLoggedIn ? (
                    <>
                        {/* Hiển thị sản phẩm */}
                        <div className="col-md-6">
                            <p className="mb-4 font-semibold" style={{color: "#8c5e58", fontSize: "30px"}}>Sản phẩm của bạn</p>
                            <div className="list-group">
                                {products.length > 0 ? (
                                    products.map(item => (
                                        <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img src={item.image} alt={item.name} className="img-thumbnail me-3" style={{ width: "100px", height: "100px" }} />
                                                <div>
                                                    <p style={{color: "#8c5e58"}}>{item.name}</p>
                                                    <p className="mb-0" style={{color: "#8c5e58"}}>{item.price.toLocaleString("vi-VN")} VND x {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có sản phẩm nào.</p>
                                )}
                            </div>
                            <p className="mt-4 font-semibold" style={{color: "#8c5e58"}}>Tổng: {calculateTotal().toLocaleString("vi-VN")} VND</p>
                        </div>

                        {/* Form thông tin người dùng */}
                        <div className="col-md-6">
                            <p className="mb-4 font-semibold" style={{color: "#8c5e58", fontSize: "30px"}}>Thông tin thanh toán</p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Họ và Tên</label>
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
                                    <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Email</label>
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
                                    <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Số điện thoại</label>
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
                                    <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Địa chỉ</label>
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
                                    <label className="form-label font-semibold" style={{color: "#8c5e58"}}>Phương thức thanh
                                        toán</label>
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
                                            <label className="form-check-label" style={{color: "#8c5e58"}}>
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
                                            <label className="form-check-label" style={{color: "#8c5e58"}}>
                                                <i className="fab fa-gg-circle fa-2x"></i> Momo
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="radio"
                                                className="form-check-input"
                                                name="paymentMethod"
                                                value="vnPay"
                                                checked={formData.paymentMethod === "vnPay"}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label" style={{color: "#8c5e58"}}>
                                                <i className="fab fa-cc-visa fa-2x"></i> VNPay
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary font-bold text-center" style={{
                                        padding: '14px',
                                        fontSize: '13px',
                                        color: '#442e2b'
                                    }}>Xác nhận thanh toán
                                    </button>
                                </div>
                            </form>
                        </div>
                    </>
                ) : (
                    <p style={{ color: "#8c5e58" }}>Vui lòng <a href="/login">đăng nhập</a> để tiếp tục.</p>
                )}
            </div>
        </div>
    );
}
