import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useNavigate} from "react-router-dom";
import {getCart} from "../../../services/Cart";
import {getOneProduct} from "../../../services/Comment";

export default function Cart() {
    const [products, setProducts] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const result = await getCart();
            const productDetails = await Promise.all(result.map(item => getOneProduct(item.product_id)));

            // Sử dụng một đối tượng để nhóm sản phẩm theo product_id
            const productMap = {};

            result.forEach((item, index) => {
                const productId = item.product_id;
                const productDetail = productDetails[index];

                // Nếu productId đã tồn tại, cộng dồn số lượng
                if (productMap[productId]) {
                    productMap[productId].quantity += item.quantity;
                    productMap[productId].totalPrice += productDetail.unit_price * item.quantity; // Cộng giá thành
                } else {
                    productMap[productId] = {
                        id: item.id,
                        product_id: productId,
                        quantity: item.quantity,
                        price: productDetail.unit_price,
                        name: productDetail.name,
                        image: productDetail.image,
                        totalPrice: productDetail.unit_price * item.quantity // Giá tổng cho sản phẩm này
                    };
                }
            });

            // Chuyển đổi productMap thành mảng để lưu vào state
            setProducts(Object.values(productMap));
        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            setProducts([]);
        }
    };


    // Tính tổng cho các sản phẩm đã chọn
    const calculateTotal = () => {
        return products
            .filter(item => selectedItems.includes(item.id)) // Chỉ tính cho các sản phẩm được chọn
            .reduce((total, item) => total + (item.price ? item.price * item.quantity : 0), 0); // Thành tiền = Giá tiền * Số lượng
    };

    const updateQuantity = (id, newQuantity) => {
        setProducts(products.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
    };

    const removeItem = (id) => {
        setProducts(products.filter(item => item.id !== id));
        setSelectedItems(selectedItems.filter(itemId => itemId !== id));
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prevState) =>
            prevState.includes(id)
                ? prevState.filter(itemId => itemId !== id)
                : [...prevState, id]
        );
    };

    const handleSelectAll = () => {
        // Nếu tất cả sản phẩm đã được chọn, thì bỏ chọn tất cả
        if (isSelectAll) {
            setSelectedItems([]);
        } else {
            // Chọn tất cả sản phẩm
            setSelectedItems(products.map(item => item.id));
        }
        setIsSelectAll(!isSelectAll);
    };

    const removeSelectedItems = () => {
        setProducts(products.filter(item => !selectedItems.includes(item.id)));
        setSelectedItems([]);
        setIsSelectAll(false);
    };

    const handleBuy = () => {
        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán.");
            return;
        }

        // Tạo chuỗi các id sản phẩm được chọn, phân tách bằng dấu phẩy
        const selectedProductIds = selectedItems.join(',');

        // Chuyển đến trang thanh toán với danh sách các id sản phẩm
        navigate(`/checkout?cartIds=${selectedProductIds}`);
    };


    return (
        <div className="container py-4">
            <p className="text-center font-semibold"
               style={{ color: "#8c5e58", marginBottom: "30px", fontSize: "30px" }}>Giỏ hàng</p>

            <div className="cart-header d-flex">
                <div className="cart-header-item" style={{ width: "10%", textAlign: "center" }}>
                    <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                    />
                </div>
                <div className="cart-header-item" style={{ width: "30%" }}>Sản phẩm</div>
                <div className="cart-header-item" style={{ width: "15%", textAlign: "right" }}>Giá tiền</div>
                <div className="cart-header-item" style={{ width: "15%", textAlign: "center" }}>Số lượng</div>
                <div className="cart-header-item" style={{ width: "15%", textAlign: "right" }}>Thành tiền</div>
                <div className="cart-header-item" style={{ width: "15%", textAlign: "center" }}>Thao tác</div>
            </div>

            {products.length === 0 ? (
                <p className="font-semibold text-center"
                   style={{ color: "#8c5e58", fontSize: "30px", marginTop: "30px" }}>Giỏ hàng của bạn trống !!!</p>
            ) : (
                <>
                    {products.map(item => (
                        <div key={item.id} className="cart-item d-flex align-items-center justify-content-between py-3"
                             style={{
                                 borderBottom: "1px solid #ddd",
                                 marginBottom: "20px"
                             }}>
                            <div className="cart-item-checkbox" style={{width: "10%", textAlign: "center"}}>
                                <input type="checkbox"
                                       checked={selectedItems.includes(item.id)}
                                       onChange={() => handleSelectItem(item.id)}
                                />
                            </div>

                            <div className="d-flex align-items-center" style={{width: "30%"}}>
                                <NavLink to={`/products/${item.productId}`} className="d-flex align-items-center">
                                    <img
                                        src={item.image} // Sử dụng hình ảnh từ sản phẩm
                                        alt={item.name} // Sử dụng tên từ sản phẩm
                                        style={{
                                            width: "80px",
                                            height: "80px",
                                            objectFit: "cover",
                                            marginRight: "15px"
                                        }}
                                    />
                                    <div style={{
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        WebkitLineClamp: 3,
                                        textOverflow: "ellipsis",
                                        whiteSpace: "normal",
                                        maxHeight: "4.5em",
                                    }}>
                                        <p style={{
                                            marginBottom: "5px",
                                            color: "#8c5e58",
                                            fontWeight: "bold"
                                        }}>{item.name}</p>
                                    </div>
                                </NavLink>
                            </div>

                            <div className="cart-item-price"
                                 style={{width: "15%", textAlign: "right", color: "#8c5e58", fontWeight: "bold"}}>
                                {item.price ? item.price.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                }) : "Chưa có giá"}
                            </div>

                            <div className="cart-item-quantity" style={{width: "15%", textAlign: "center"}}>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    style={{
                                        width: "60px",
                                        padding: "5px",
                                        borderRadius: "5px",
                                        border: "1px solid #ddd"
                                    }}
                                />
                            </div>

                            <div className="cart-item-total"
                                 style={{width: "15%", textAlign: "right", color: "#8c5e58", fontWeight: "bold"}}>
                                {(item.price * item.quantity).toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </div>

                            <div className="cart-item-remove" style={{width: "15%", textAlign: "center"}}>
                                <button className="btn btn-link" style={{padding: "0", color: "#f77c8c"}}
                                        onClick={() => removeItem(item.id)}>
                                    <i className="fas fa-trash"></i> Xóa
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="cart-summary d-flex justify-content-between align-items-center"
                         style={{
                             backgroundColor: "#feeef0",
                             padding: "20px",
                             borderRadius: "10px",
                             marginBottom: "20px"
                         }}>
                        <div>
                            <button className="btn btn-primary font-semibold" style={{marginRight: "20px"}}
                                    onClick={removeSelectedItems}>
                                Xóa các sản phẩm đã chọn ({selectedItems.length})
                            </button>
                        </div>

                        <div className="d-flex justify-content-end align-items-center" style={{width: "100%"}}>
                            <p className="font-semibold" style={{color: "#8c5e58", fontSize: "18px", margin: "10px"}}>
                                Tạm tính: <span style={{color: "red"}}>{calculateTotal().toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}</span>
                            </p>
                            <button className="btn btn-primary font-semibold"
                                    style={{
                                        padding: "10px 20px",
                                        fontSize: "16px",
                                        borderRadius: "5px"
                                    }}
                                    onClick={handleBuy}>
                                Thanh toán
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
