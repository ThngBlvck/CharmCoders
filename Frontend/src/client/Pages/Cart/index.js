import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Sản phẩm 1",
            price: 100000,
            quantity: 2,
            image: "link-to-image-1.jpg", // Thay bằng link hình ảnh thật
        },
        {
            id: 2,
            name: "Sản phẩm 2",
            price: 200000,
            quantity: 1,
            image: "link-to-image-2.jpg", // Thay bằng link hình ảnh thật
        },
    ]);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const updateQuantity = (id, newQuantity) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    return (
        <div className="container py-5">
            <h2 className="mb-4">Giỏ hàng của bạn</h2>
            {cartItems.length === 0 ? (
                <p>Giỏ hàng của bạn trống.</p>
            ) : (
                <table className="table table-striped">
                    <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Hình ảnh</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th>Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {cartItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>
                                <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
                            </td>
                            <td>{item.price.toLocaleString("vi-VN")} VND</td>
                            <td>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    style={{ width: "60px" }}
                                />
                            </td>
                            <td>{(item.price * item.quantity).toLocaleString("vi-VN")} VND</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => removeItem(item.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <h4 className="mt-4">Tổng: {calculateTotal().toLocaleString("vi-VN")} VND</h4>
            <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/checkout'}>Thanh toán</button>
        </div>
    );
}
