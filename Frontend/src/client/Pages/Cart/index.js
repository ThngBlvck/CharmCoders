import React, { useEffect, useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { deleteCart, getCart, updateCart } from "../../../services/Cart";
import { getOneProduct } from "../../../services/Comment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import debounce from 'lodash.debounce';

export default function Cart() {
    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const productIdFromUrl = queryParams.get("productId");

    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (products.length > 0 && productIdFromUrl) {
            const selectedProduct = products.find(product => product.product_id.toString() === productIdFromUrl);
            if (selectedProduct) {
                if (!selectedItems.includes(selectedProduct.id)) {
                    setSelectedItems(prev => [...prev, selectedProduct.id]);
                }
            }
        }
    }, [products, productIdFromUrl]);

    const fetchCart = async () => {
        setLoading(true);
        try {
            const result = await getCart();
            const productDetails = await Promise.all(result.map(item => getOneProduct(item.product_id)));

            const productMap = {};
            result.forEach((item, index) => {
                const productId = item.product_id;
                const productDetail = productDetails[index];

                const price = productDetail.sale_price || productDetail.unit_price; // Use sale_price if available
                if (productMap[productId]) {
                    productMap[productId].quantity += item.quantity;
                    productMap[productId].totalPrice += price * item.quantity;
                } else {
                    productMap[productId] = {
                        id: item.id,
                        product_id: productId,
                        quantity: item.quantity,
                        price: price,
                        salePrice: productDetail.sale_price,  // Store sale_price
                        name: productDetail.name,
                        image: productDetail.image,
                        totalPrice: price * item.quantity
                    };
                }
            });

            const productsArray = Object.values(productMap);
            setProducts(productsArray);

            if (productIdFromUrl) {
                const selectedProduct = productsArray.find(product => product.product_id === productIdFromUrl);
                if (selectedProduct) {
                    setSelectedItems(prev => [...prev, selectedProduct.id]);
                }
            }

        } catch (error) {
            console.error("Error fetching cart products:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return products
            .filter(item => selectedItems.includes(item.id))
            .reduce((total, item) => total + (item.price ? item.price * item.quantity : 0), 0);
    };

    const removeItem = async (id) => {
        try {
            await deleteCart(id);
            setProducts(products.filter(item => item.id !== id));
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } catch (error) {
            console.error("Error removing item:", error);
            alert("Error removing item.");
        }
    };

    const handleSelectItem = (id) => {
        setSelectedItems((prevState) =>
            prevState.includes(id)
                ? prevState.filter(itemId => itemId !== id)
                : [...prevState, id]
        );
    };

    const handleSelectAll = () => {
        if (isSelectAll) {
            setSelectedItems([]);
        } else {
            setSelectedItems(products.map(item => item.id));
        }
        setIsSelectAll(!isSelectAll);
    };

    const removeSelectedItems = async () => {
        try {
            await Promise.all(selectedItems.map(id => deleteCart(id)));
            setProducts(products.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]);
            setIsSelectAll(false);
        } catch (error) {
            console.error("Error removing selected items:", error);
            alert("Error removing selected items.");
        }
    };

    const updateQuantity = async (id, quantity) => {
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === id ? { ...product, quantity } : product
            )
        );

        debouncedUpdateQuantity(id, quantity);
    };

    const debouncedUpdateQuantity = debounce(async (id, quantity) => {
        try {
            await updateCart(id, quantity);
        } catch (error) {
            console.error("Error updating quantity:", error);
        }
    }, 500);

    const handleQuantityChange = (e, id) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleBuy = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No items selected',
                text: 'Please select items to proceed to checkout.',
                confirmButtonColor: '#8c5e58',
                confirmButtonText: 'OK',
            });
            return;
        }

        const selectedProductIds = selectedItems.join(',');
        navigate(`/checkout?cartIds=${selectedProductIds}`);
    };

    return (
        <div className="container py-4">
            <p className="text-center font-semibold" style={{ color: "#8c5e58", marginBottom: "30px", fontSize: "30px" }}>
                Giỏ hàng
            </p>

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

            {loading ? (
                <div className="d-flex flex-column align-items-center" style={{ marginTop: '10rem', marginBottom: '10rem' }}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '4rem', color: '#8c5e58' }} />
                    <p className="mt-3" style={{ color: '#8c5e58', fontSize: '18px' }}>Đang tải...</p>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p className="font-semibold text-center" style={{ color: "#8c5e58", fontSize: "30px", marginTop: "30px" }}>
                            Giỏ hàng của bạn trống !!!
                        </p>
                    ) : (
                        <>
                            {products.map(item => (
                                <div key={item.id} className="cart-item d-flex align-items-center justify-content-between py-3" style={{ borderBottom: "1px solid #ddd", marginBottom: "20px" }}>
                                    <div className="cart-item-checkbox" style={{ width: "10%", textAlign: "center" }}>
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleSelectItem(item.id)}
                                            disabled={item.quantity === 0} // Disable selection if out of stock
                                        />
                                    </div>

                                    <div className="d-flex align-items-center" style={{ width: "30%" }}>
                                        <NavLink to={`/products/${item.product_id}`} className="d-flex align-items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "15px" }}
                                            />
                                            <div style={{
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                WebkitLineClamp: 3,
                                                textOverflow: "ellipsis",
                                                whiteSpace: "normal",
                                                maxHeight: "5rem"
                                            }}>
                                                {item.name}
                                            </div>
                                        </NavLink>
                                    </div>

                                    <div className="cart-item-price" style={{ width: "15%", textAlign: "right", color: "#8c5e58", fontWeight: "bold" }}>
                                        {item.salePrice
                                            ? item.salePrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                                            : item.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </div>

                                    <div className="cart-item-quantity" style={{ width: "15%", textAlign: "center" }}>
                                        {item.quantity === 0 ? (
                                            <p className="text-danger font-bold" style={{ fontSize: '16px' }}>Hết hàng</p>
                                        ) : (
                                            <div className="input-group" style={{ width: "160px", margin: "0 auto" }}>
                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => handleQuantityChange({ target: { value: item.quantity - 1 } }, item.id)}
                                                    disabled={item.quantity <= 1}
                                                    style={{
                                                        backgroundColor: "#ffa69e",
                                                        borderColor: "#8c5e58",
                                                        color: "#8c5e58",
                                                        borderRadius: "50%",
                                                        padding: "0.5rem",
                                                        fontSize: "1.25rem",
                                                        minWidth: "40px",
                                                        height: "40px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <span style={{ fontWeight: "bold" }}>-</span>
                                                </button>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(e, item.id)}
                                                    style={{
                                                        width: "60px",
                                                        textAlign: "center",
                                                        border: "2px solid #8c5e58",
                                                        borderRadius: "10px",
                                                        fontWeight: "bold",
                                                        fontSize: "1.1rem",
                                                        backgroundColor: "#f7f7f7",
                                                        margin: "0 0.5rem",
                                                        transition: "border-color 0.3s",
                                                    }}
                                                    disabled={item.quantity === 0} // Disable input if out of stock
                                                    onFocus={(e) => e.target.style.borderColor = "#8c5e58"}
                                                    onBlur={(e) => e.target.style.borderColor = "#8c5e58"}
                                                />

                                                <button
                                                    className="btn btn-sm"
                                                    onClick={() => handleQuantityChange({ target: { value: item.quantity + 1 } }, item.id)}
                                                    disabled={item.quantity === 0} // Disable button if out of stock
                                                    style={{
                                                        backgroundColor: "#ffa69e",
                                                        borderColor: "#8c5e58",
                                                        color: "#8c5e58",
                                                        borderRadius: "50%",
                                                        padding: "0.5rem",
                                                        fontSize: "1.25rem",
                                                        minWidth: "40px",
                                                        height: "40px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <span style={{ fontWeight: "bold" }}>+</span>
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <div className="cart-item-total" style={{ width: "15%", textAlign: "right", color: "#8c5e58", fontWeight: "bold" }}>
                                        {(item.price * item.quantity).toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </div>

                                    <div className="cart-item-actions" style={{width: "15%", textAlign: "center"}}>
                                        <button className="btn btn-primary" onClick={removeSelectedItems}
                                                style={{backgroundColor: "#ffffff", borderColor: "#ffffff"}}>
                                            <FontAwesomeIcon icon={faTrash}
                                                             style={{color: "red"}}/> {/* This sets the trash icon color to red */}
                                        </button>

                                    </div>
                                </div>
                            ))}

                            <div className="cart-footer d-flex justify-content-between">
                                {selectedItems.length > 0 && (
                                    <button className="btn btn-primary" onClick={removeSelectedItems}
                                            style={{backgroundColor: "#ffa69e", borderColor: "#8c5e58"}}>
                                        Xóa đã chọn
                                    </button>
                                )}

                                <div className="cart-footer-total" style={{fontSize: "20px", color: "#8c5e58"}}>
                                    Tổng cộng:{" "}
                                    <span style={{fontWeight: "bold"}}>
                                    {calculateTotal().toLocaleString("vi-VN", {style: "currency", currency: "VND"})}
                                </span>
                                </div>

                                <button className="btn btn-primary" onClick={handleBuy}
                                        style={{backgroundColor: "#ffa69e", borderColor: "#8c5e58"}}>
                                    Mua hàng
                                </button>
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    );

}
