import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {deleteCart, getCart} from "../../../services/Cart";
import {getOneProduct} from "../../../services/Comment";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Swal from 'sweetalert2';

export default function Cart() {
    const [products, setProducts] = useState([]);

    const [selectedItems, setSelectedItems] = useState([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation(); // Sử dụng useLocation để lấy tham số từ URL
    const queryParams = new URLSearchParams(location.search);
    const productIdFromUrl = queryParams.get("productId"); // Thay đổi tên nếu cần


    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (products.length > 0 && productIdFromUrl) {
            // Chuyển đổi productIdFromUrl sang kiểu dữ liệu phù hợp nếu cần
            const selectedProduct = products.find(product => product.product_id.toString() === productIdFromUrl);
            if (selectedProduct) {
                // Kiểm tra xem sản phẩm đã có trong selectedItems chưa
                if (!selectedItems.includes(selectedProduct.id)) {
                    setSelectedItems(prev => [...prev, selectedProduct.id]); // Thêm id sản phẩm vào selectedItems
                }
            }
        }
    }, [products, productIdFromUrl]); // Thực hiện khi products hoặc productIdFromUrl thay đổi

    const fetchCart = async () => {
        setLoading(true);
        try {
            const result = await getCart();
            console.log("Cart Result: ", result);

            const productDetails = await Promise.all(result.map(item => getOneProduct(item.product_id)));
            console.log("Product Details: ", productDetails);

            const productMap = {};
            result.forEach((item, index) => {
                const productId = item.product_id;
                const productDetail = productDetails[index];

                if (productMap[productId]) {
                    productMap[productId].quantity += item.quantity;
                    productMap[productId].totalPrice += productDetail.unit_price * item.quantity;
                } else {
                    productMap[productId] = {
                        id: item.id,
                        product_id: productId,
                        quantity: item.quantity,
                        price: productDetail.unit_price,
                        name: productDetail.name,
                        image: productDetail.image,
                        totalPrice: productDetail.unit_price * item.quantity
                    };
                }
            });

            const productsArray = Object.values(productMap);
            setProducts(productsArray);

            // Cập nhật selectedItems dựa vào productIdFromUrl
            if (productIdFromUrl) {
                const selectedProduct = productsArray.find(product => product.product_id === productIdFromUrl);
                if (selectedProduct) {
                    setSelectedItems(prev => [...prev, selectedProduct.id]); // Thêm id sản phẩm vào selectedItems
                }
            }

        } catch (error) {
            console.error("Lỗi khi lấy danh sách sản phẩm:", error);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // Tính tổng cho các sản phẩm đã chọn
    const calculateTotal = () => {
        return products
            .filter(item => selectedItems.includes(item.id)) // Chỉ tính cho các sản phẩm được chọn
            .reduce((total, item) => total + (item.price ? item.price * item.quantity : 0), 0); // Thành tiền = Giá tiền * Số lượng
    };

    const updateQuantity = (id, newQuantity) => {
        setProducts(products.map(item => item.id === id ? {...item, quantity: newQuantity} : item));
    };

    const removeItem = async (id) => {
        try {
            await deleteCart(id); // Gọi API để xóa sản phẩm khỏi cơ sở dữ liệu
            // Nếu xóa thành công, cập nhật state
            setProducts(products.filter(item => item.id !== id));
            setSelectedItems(selectedItems.filter(itemId => itemId !== id));
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            alert("Có lỗi xảy ra khi xóa sản phẩm."); // Hiển thị thông báo lỗi
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
        // Nếu tất cả sản phẩm đã được chọn, thì bỏ chọn tất cả
        if (isSelectAll) {
            setSelectedItems([]);
        } else {
            // Chọn tất cả sản phẩm
            setSelectedItems(products.map(item => item.id));
        }
        setIsSelectAll(!isSelectAll);
    };

    const removeSelectedItems = async () => {
        try {
            // Gọi API để xóa từng sản phẩm đã chọn
            await Promise.all(selectedItems.map(id => deleteCart(id)));

            // Cập nhật state sau khi xóa thành công
            setProducts(products.filter(item => !selectedItems.includes(item.id)));
            setSelectedItems([]); // Đặt lại danh sách đã chọn
            setIsSelectAll(false); // Đặt lại trạng thái chọn tất cả
        } catch (error) {
            console.error("Lỗi khi xóa các sản phẩm đã chọn:", error);
            alert("Có lỗi xảy ra khi xóa sản phẩm."); // Hiển thị thông báo lỗi
        }
    };


    const handleBuy = () => {
        if (selectedItems.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Không có sản phẩm',
                text: 'Cần có sản phẩm để thanh toán.',
                confirmButtonColor: '#8c5e58',
                confirmButtonText: 'OK',
                customClass: {
                    title: 'swal2-title-custom',
                    content: 'swal2-content-custom'
                }
            });
            return;
        }

        const selectedProductIds = selectedItems.join(',');
        navigate(`/checkout?cartIds=${selectedProductIds}`);
    };

    return (
        <div className="container py-4">
            <p className="text-center font-semibold"
               style={{color: "#8c5e58", marginBottom: "30px", fontSize: "30px"}}>Giỏ hàng</p>

            <div className="cart-header d-flex">
                <div className="cart-header-item" style={{width: "10%", textAlign: "center"}}>
                    <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                    />
                </div>
                <div className="cart-header-item" style={{width: "30%"}}>Sản phẩm</div>
                <div className="cart-header-item" style={{width: "15%", textAlign: "right"}}>Giá tiền</div>
                <div className="cart-header-item" style={{width: "15%", textAlign: "center"}}>Số lượng</div>
                <div className="cart-header-item" style={{width: "15%", textAlign: "right"}}>Thành tiền</div>
                <div className="cart-header-item" style={{width: "15%", textAlign: "center"}}>Thao tác</div>
            </div>

            {loading ? (
                <div className="d-flex flex-column align-items-center"
                     style={{marginTop: '10rem', marginBottom: '10rem'}}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                    <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                </div>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p className="font-semibold text-center"
                           style={{color: "#8c5e58", fontSize: "30px", marginTop: "30px"}}>Giỏ hàng của bạn trống
                            !!!</p>
                    ) : (
                        <>
                            {products.map(item => (
                                <div key={item.id}
                                     className="cart-item d-flex align-items-center justify-content-between py-3"
                                     style={{
                                         borderBottom: "1px solid #ddd",
                                         marginBottom: "20px"
                                     }}>
                                    <div className="cart-item-checkbox" style={{width: "10%", textAlign: "center"}}>
                                        <input type="checkbox"
                                               checked={selectedItems.includes(item.id)} // Kiểm tra xem item có trong selectedItems không
                                               onChange={() => handleSelectItem(item.id)}
                                        />
                                    </div>

                                    <div className="d-flex align-items-center" style={{width: "30%"}}>
                                        <NavLink to={`/products/${item.product_id}`}
                                                 className="d-flex align-items-center">
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
                                         style={{
                                             width: "15%",
                                             textAlign: "right",
                                             color: "#8c5e58",
                                             fontWeight: "bold"
                                         }}>
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
                                         style={{
                                             width: "15%",
                                             textAlign: "right",
                                             color: "#8c5e58",
                                             fontWeight: "bold"
                                         }}>
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
                        </>
                    )}
                </>
            )}

            <div className="cart-summary d-flex justify-content-between align-items-center"
                 style={{
                     backgroundColor: "#feeef0",
                     padding: "20px",
                     borderRadius: "10px",
                     marginBottom: "20px"
                 }}>
                <div>
                    {selectedItems.length > 0 && ( // Chỉ hiển thị nút xóa khi có sản phẩm được chọn
                        <button className="btn btn-primary font-semibold"
                                style={{marginRight: "20px", width: "220px"}} // Đặt chiều rộng của nút
                                onClick={removeSelectedItems}>
                            Xóa sản phẩm đã chọn ({selectedItems.length})
                        </button>
                    )}
                </div>

                <div className="d-flex justify-content-end align-items-center" style={{width: "100%"}}>
                    <p className="font-semibold"
                       style={{color: "#8c5e58", fontSize: "18px", margin: "10px"}}>
                        Tạm tính: <span
                        style={{color: "red"}}>{calculateTotal().toLocaleString("vi-VN", {
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


        </div>
    );
}
