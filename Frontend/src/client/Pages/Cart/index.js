import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css"; // Giữ lại nếu cần

export default function Cart() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Sản phẩm 1",
            price: 100000,
            quantity: 2,
            image: "https://via.placeholder.com/100", // Thay bằng link hình ảnh thật
        },
        {
            id: 2,
            name: "Sản phẩm 2",
            price: 200000,
            quantity: 1,
            image: "https://via.placeholder.com/100", // Thay bằng link hình ảnh thật
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
        <div className="container py-3">
            <p className="text-center display-3" style={{color: "#8c5e58", marginBottom: "60px"}}>Giỏ hàng</p>
            {cartItems.length === 0 ? (
                <p>Giỏ hàng của bạn trống.</p>
            ) : (
                <table className="table">
                    <thead>
                    <tr style={{color: "#8c5e58"}}>
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
                        <tr key={item.id} className="font-semibold" style={{color: "#8c5e58"}}>
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
                                <button className="btn btn-primary font-bold" style={{
                                    padding: '14px',
                                    fontSize: '13px',
                                    color: '#442e2b'
                                }} onClick={() => removeItem(item.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <p className="mt-4 font-semibold" style={{color: "#8c5e58"}}>Tổng: {calculateTotal().toLocaleString("vi-VN")} VND</p>
            <button className="btn btn-primary mt-3 font-bold" style={{
                padding: '14px',
                fontSize: '13px',
                color: '#442e2b'
            }} onClick={() => window.location.href = '/checkout'}>Thanh toán</button>
        </div>
    );
}
