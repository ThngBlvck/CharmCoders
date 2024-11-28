import React, {useEffect, useState} from "react";
import "../../../assets/styles/css/bootstrap.min.css";
import {NavLink, useNavigate, useLocation} from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import {deleteCart, getCart, updateCart} from "../../../services/Cart";
import {getOneProduct} from "../../../services/Product";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import debounce from 'lodash.debounce';
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
                    productMap[productId].totalPrice += item.unit_price * item.quantity;
                } else {
                    productMap[productId] = {
                        id: item.id,
                        product_id: productId,
                        quantity: item.quantity,
                        unit_price: productDetail.unit_price,
                        sale_price: productDetail.sale_price,
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
            .reduce((total, item) => {
                const price = item.sale_price || item.unit_price; // Nếu có sale_price thì lấy sale_price, nếu không có thì lấy unit_price
                return total + (price ? price * item.quantity : 0); // Thành tiền = Giá tiền * Số lượng
            }, 0);
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

    const updateQuantity = async (id, quantity) => {
        // Cập nhật số lượng trong state ngay lập tức mà không cần load lại trang
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === id ? { ...product, quantity } : product
            )
        );

        // Cập nhật số lượng trên server sau một khoảng thời gian (debounce)
        debouncedUpdateQuantity(id, quantity);
    };

    // Hàm debounce để chỉ gọi API khi người dùng ngừng thay đổi trong một khoảng thời gian
    const debouncedUpdateQuantity = debounce(async (id, quantity) => {
        try {
            // Gọi API để cập nhật số lượng sản phẩm trong giỏ hàng
            await updateCart(id, quantity);
            console.log("Đã cập nhật số lượng thành công");
        } catch (error) {
            console.error("Lỗi khi cập nhật số lượng:", error);
        }
    }, 500); // 500ms debounce delay (bạn có thể điều chỉnh thời gian này)

    const handleQuantityChange = (e, id) => {
        const newQuantity = parseInt(e.target.value);
        if (newQuantity > 0) {
            updateQuantity(id, newQuantity);
        }
    };

    const handleBuy = () => {
        if (selectedItems.length === 0) {
            toast.warn("Cần có sản phẩm để thanh toán.");
            return;
        }

        const selectedProductIds = selectedItems.join(',');
        navigate(`/checkout?cartIds=${selectedProductIds}`);
    };

    return (
        <div className="container rounded">
            <p className="text-center font-semibold text-dGreen fs-30"
               style={{ marginBottom: "30px"}}>Giỏ hàng</p>

            <div className="cart-header d-flex bg-carts">
                <div className="cart-header-item checkbox-shadow" style={{width: "10%", textAlign: "center"}}>
                    <input
                        type="checkbox"
                        checked={isSelectAll}
                        onChange={handleSelectAll}
                    />
                </div>
                <div className="cart-header-item text-dGreen" style={{width: "30%"}}>Sản phẩm</div>
                <div className="cart-header-item text-dGreen" style={{width: "15%", textAlign: "right"}}>Giá tiền</div>
                <div className="cart-header-item text-dGreen" style={{width: "15%", textAlign: "center"}}>Số lượng</div>
                <div className="cart-header-item text-dGreen" style={{width: "15%", textAlign: "right"}}>Thành tiền</div>
                <div className="cart-header-item text-dGreen" style={{width: "15%", textAlign: "center"}}>Thao tác</div>
            </div>

            {loading ? (
                <ul className="list-group">
                    {Array.from({length: 3}).map((_, index) => (
                        <li
                            key={index}
                            className="list-group-item d-flex align-items-center justify-content-between py-3"
                            style={{
                                borderBottom: "1px solid #ddd",
                                marginBottom: "20px",
                            }}
                        >
                            {/* Skeleton cho checkbox */}
                            <div style={{width: "10%", textAlign: "center"}}>
                                <Skeleton circle={true} width={20} height={20}/>
                            </div>

                            {/* Skeleton cho sản phẩm */}
                            <div className="d-flex align-items-center" style={{width: "30%"}}>
                                <Skeleton width={80} height={80} style={{marginRight: "15px"}}/>
                                <Skeleton width="60%"/>
                            </div>

                            {/* Skeleton cho giá tiền */}
                            <div style={{width: "15%", textAlign: "right"}}>
                                <Skeleton width="80%"/>
                            </div>

                            {/* Skeleton cho số lượng */}
                            <div style={{width: "15%", textAlign: "center"}}>
                                <Skeleton width={60} height={30}/>
                            </div>

                            {/* Skeleton cho thành tiền */}
                            <div style={{width: "15%", textAlign: "right"}}>
                                <Skeleton width="80%"/>
                            </div>

                            {/* Skeleton cho thao tác */}
                            <div style={{width: "15%", textAlign: "center"}}>
                                <Skeleton circle={true} width={30} height={30}/>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    {products.length === 0 ? (
                        <p className="font-semibold text-center mb-4 text-dGreen fs-30"
                           style={{marginTop: "30px"}}>Giỏ hàng của bạn trống
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
                                                <p className="text-dGreen font-bold" style={{
                                                    marginBottom: "5px",
                                                }}>{item.name}</p>
                                            </div>
                                        </NavLink>
                                    </div>

                                    <div className="cart-item-price text-dGreen font-bold" style={{
                                        width: "15%",
                                        textAlign: "right",
                                    }}>
                                        {item.sale_price ? (
                                            <div>
                                                <span className="text-dGreen" style={{textDecoration: "line-through"}}>
                                                    {item.unit_price.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND"
                                                    })}
                                                </span>
                                                <br/>
                                                <span className="font-bold salePr">
                                                    {item.sale_price.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND"
                                                    })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="font-bold text-dGreen">
                                                {item.unit_price.toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND"
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    <div className="cart-item-quantity" style={{width: "15%", textAlign: "center"}}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(e, item.id)} // Thay đổi sự kiện onChange
                                            style={{
                                                width: "60px",
                                                padding: "5px",
                                                borderRadius: "5px",
                                                border: "1px solid #ddd"
                                            }}
                                        />
                                    </div>

                                    <div className="cart-item-total font-bold text-dGreen"
                                         style={{
                                             width: "15%",
                                             textAlign: "right",
                                         }}>
                                        {(
                                            (item.sale_price && !isNaN(item.sale_price) ? item.sale_price : item.unit_price)
                                            * item.quantity
                                        ).toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}
                                    </div>

                                    <div className="cart-item-remove text-center" style={{width: "15%"}}>
                                        <button className="text-del p-0" onClick={() => removeItem(item.id)}>
                                            <i className="fas fa-trash"></i> Xóa
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}

            <div className="cart-summary d-flex justify-content-between align-items-center bg-carts footer-carts">
                <div>
                    {selectedItems.length > 0 && ( // Chỉ hiển thị nút xóa khi có sản phẩm được chọn
                        <button className="butn-del font-semibold rounded shadow"
                                style={{marginRight: "20px", width: "220px"}} // Đặt chiều rộng của nút
                                onClick={removeSelectedItems}>
                            Xóa sản phẩm đã chọn ({selectedItems.length})
                        </button>
                    )}
                </div>

                <div className="d-flex justify-content-end align-items-center" style={{width: "100%"}}>
                    <p className="font-semibold text-dGreen fs-18"
                       style={{margin: "10px"}}>
                        Tạm tính: <span className="priceAmount">{calculateTotal().toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                    })}</span>
                    </p>
                    <button className="butn font-semibold w-40 rounded shadow fs-16 btn-20"
                            style={{
                                padding: "10px 20px",
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
