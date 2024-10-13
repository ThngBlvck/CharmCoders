import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCheckoutData, makeMomoPayment } from '../../../services/Product'; // Import service
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
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        fetchProductAndUserData();
    }, [id]);

    const fetchProductAndUserData = async () => {
        try {
            const userToken = localStorage.getItem("token");

            // Kiểm tra xem có token không
            if (!userToken) {
                console.log("Chưa có token."); // Log nếu không có token
                setIsLoggedIn(false);
                return; // Không tiếp tục nếu thiếu token
            }

            // Kiểm tra xem id (product_id) có hợp lệ không
            if (!id) {
                console.log("Chưa có product_id."); // Log nếu không có product_id
                return; // Không tiếp tục nếu thiếu product_id
            }

            console.log("Product ID:", id); // Kiểm tra product ID

            // Gọi API lấy thông tin người dùng và sản phẩm
            const response = await getCheckoutData(userToken, id);
            console.log("Response từ API:", response); // In ra phản hồi từ API

            // Kiểm tra phản hồi từ API
            if (response.error) {
                console.error("Lỗi từ API:", response.error);
                setIsLoggedIn(false);
                return;
            }

            const { userData, productData } = response;

            if (userData && productData) {
                setIsLoggedIn(true);
                setFormData({
                    ...formData,
                    name: userData.name,
                    email: userData.email,
                    address: userData.address,
                    phone: userData.phone,
                });
                setProduct(productData); // Hiển thị sản phẩm
            } else {
                setIsLoggedIn(false);
                console.error("Không có dữ liệu người dùng hoặc sản phẩm.");
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu checkout:', error);
            setIsLoggedIn(false);
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
        return product.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    return (
        <div className="container py-5">
            <div className="row">
                {/* Kiểm tra trạng thái đăng nhập */}
                {isLoggedIn ? (
                    <>
                        {/* Hiển thị sản phẩm */}
                        <div className="col-md-6">
                            <p className="mb-4 font-semibold" style={{ color: "#8c5e58", fontSize: "30px" }}>Sản phẩm của bạn</p>
                            <div className="list-group">
                                {product.length > 0 ? (
                                    product.map(item => (
                                        <div key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center">
                                                <img src={item.image} alt={item.name} className="img-thumbnail me-3" style={{ width: "100px", height: "100px" }} />
                                                <div>
                                                    <p style={{ color: "#8c5e58" }}>{item.name}</p>
                                                    <p className="mb-0" style={{ color: "#8c5e58" }}>{item.price.toLocaleString("vi-VN")} VND x {item.quantity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có sản phẩm nào.</p>
                                )}
                            </div>
                            <p className="mt-4 font-semibold" style={{ color: "#8c5e58" }}>Tổng: {calculateTotal().toLocaleString("vi-VN")} VND</p>
                        </div>

                        {/* Form thông tin người dùng */}
                        <div className="col-md-6">
                            <p className="mb-4 font-semibold" style={{ color: "#8c5e58", fontSize: "30px" }}>Thông tin thanh toán</p>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label font-semibold" style={{ color: "#8c5e58" }}>Họ và Tên</label>
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
                ) : (
                    <p style={{color: "#8c5e58"}}>Vui lòng <a href="/login">đăng nhập</a> để tiếp tục.</p>
                )}
            </div>
        </div>
    );
}
