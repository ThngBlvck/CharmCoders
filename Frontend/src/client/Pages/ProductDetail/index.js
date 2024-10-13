import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getOneProduct } from "../../../services/Product";
import { getOneBrand } from "../../../services/Brand";
import { getOneCategory } from "../../../services/Category";
import { addToCart } from "../../../services/Cart";
import { jwtDecode } from 'jwt-decode';

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brandName, setBrandName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [cart, setCart] = useState({});
    const [userId, setUserId] = useState(null);
    const token = localStorage.getItem('token'); // Lấy token từ localStorage
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            const decoded = jwtDecode(token); // Giải mã token
            setUserId(decoded.userId); // Lưu userId vào state
            console.log("userId:", userId);
        }

        fetchOneProduct();
    }, [id]);

    const fetchOneProduct = async () => {
        try {
            const result = await getOneProduct(id);
            setProduct(result);

            if (result.brand_id) {
                const brandResult = await getOneBrand(result.brand_id);
                setBrandName(brandResult.name);
            }

            if (result.category_id) {
                const categoryResult = await getOneCategory(result.category_id);
                setCategoryName(categoryResult.name);
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        }
    };

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setCart(prevCart => ({
                ...prevCart,
                [product.id]: value
            }));
        }
    };

    const handleAddToCart = async () => {
        if (!token) {
            alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!');
            return; // Dừng lại nếu không có token
        }

        try {
            const quantity = cart[product.id] || 1;
            await addToCart(userId, product.id, quantity); // Sử dụng userId từ state
            alert('Sản phẩm đã được thêm vào giỏ hàng!');
            navigate('/cart'); // Chuyển đến trang giỏ hàng
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error);
            alert('Không thể thêm sản phẩm vào giỏ hàng.');
        }
    };

    const handleBuyNow = () => {
        if (!token) {
            alert('Bạn cần đăng nhập để mua ngay sản phẩm!');
            return; // Dừng lại nếu không có token
        }

        // Chuyển đến trang thanh toán chỉ với productId
        navigate(`/checkout?productId=${product.id}`); // Chuyển đến trang thanh toán
    };

    return (
        <div className="container my-5">
            {product ? (
                <div className="row">
                    <div className="col-md-9 d-flex justify-start">
                        <div className="row">
                            <div className="col-5">
                                <img src={product.image} alt="Product" className="img-fluid rounded" />
                            </div>
                            <div className="col-7 d-flex flex-column align-content-start">
                                <p className="mb-3" style={{ fontSize: "26px", color: "#8c5e58" }}>{product.name}</p>
                                <p className="mb-3" style={{ color: "#8c5e58" }}>{product.unit_price.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}</p>
                                <p className="mb-3" style={{ color: "#8c5e58" }}>{brandName}</p>
                                <p className="mb-3" style={{ color: "#8c5e58" }}>{product.weight}</p>

                                <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                    <span style={{ color: "#8c5e58" }}>Số lượng:</span>
                                    <input
                                        type="number"
                                        value={cart[product.id] || 1}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        max="99"
                                        className="form-control mx-2 rounded"
                                        style={{ width: "80px" }}
                                    />
                                </div>

                                <div className="d-flex justify-content-start">
                                    <button className="btn btn-primary mr-2 font-semibold"
                                            style={{ padding: '16px', fontSize: '13px', color: '#442e2b' }}
                                            onClick={handleBuyNow}>
                                        <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                              style={{ marginRight: "6px" }}></i>Mua
                                            ngay</p>
                                    </button>
                                    <button className="btn btn-primary font-semibold"
                                            style={{ fontSize: '13px' }}
                                            onClick={handleAddToCart}>
                                        <p><i className="fa fa-shopping-basket" aria-hidden="true"
                                              style={{ marginRight: "6px" }}></i>Thêm
                                            vào giỏ</p>
                                    </button>
                                </div>
                            </div>

                            <div className="product-details">
                                <p style={{ color: "#8c5e58", fontSize: "20px", marginBottom: "1rem" }} className="font-bold">Thông tin chi tiết sản phẩm:</p>
                                <ul>
                                    <li style={{ color: "#8c5e58", marginBottom: "2px" }}><strong className="font-semibold">Tên sản phẩm:</strong> {product.name}</li>
                                    <li style={{ color: "#8c5e58", marginBottom: "2px" }}><strong className="font-semibold">Mô tả sản phẩm:</strong> {product.content}</li>
                                    <li style={{ color: "#8c5e58", marginBottom: "2px" }}><strong className="font-semibold">Thương hiệu:</strong> {brandName}</li>
                                    <li style={{ color: "#8c5e58", marginBottom: "2px" }}><strong className="font-semibold">Danh mục:</strong> {categoryName}</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="col-3 d-flex justify-end">
                        <div className="row text-center d-flex flex-column">
                            <div className="col mb-3">
                                <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                                     style={{
                                         maxWidth: "200px",
                                         backgroundColor: '#fff7f8'
                                     }}>
                                    <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng"
                                         className="img-fluid mb-3 rounded"
                                         style={{width: '100px', objectFit: 'cover'}}/>
                                    <p style={{color: '#8c5e58'}} className="font-bold">Thanh toán khi nhận hàng</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                                     style={{
                                         maxWidth: "200px",
                                         backgroundColor: '#fff7f8'
                                     }}>
                                    <img src="https://via.placeholder.com/150x150" alt="Thương hiệu uy tín toàn cầu"
                                         className="img-fluid mb-3 rounded"
                                         style={{width: '100px', objectFit: 'cover'}}/>
                                    <p style={{color: '#8c5e58'}} className="font-bold">Thương hiệu uy tín toàn cầu</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                                     style={{
                                         maxWidth: "200px",
                                         backgroundColor: '#fff7f8'
                                     }}>
                                    <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí"
                                         className="img-fluid mb-3 rounded"
                                         style={{width: '100px', objectFit: 'cover'}}/>
                                    <p style={{color: '#8c5e58'}} className="font-bold">30 ngày đổi trả miễn phí</p>
                                </div>
                            </div>

                            <div className="col mb-3">
                                <div className="p-4 d-flex flex-column align-items-center border border-primary w-100"
                                     style={{
                                         maxWidth: "200px",
                                         backgroundColor: '#fff7f8'
                                     }}>
                                    <img src="https://via.placeholder.com/150x150" alt="Sản phẩm chính hãng 100%"
                                         className="img-fluid mb-3 rounded"
                                         style={{width: '100px', objectFit: 'cover'}}/>
                                    <p style={{color: '#8c5e58'}} className="font-bold">Sản phẩm chính hãng 100%</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*/!* Form bình luận *!/*/}
                    {/*<div className="row mt-5">*/}
                    {/*    <div className="col-12">*/}
                    {/*        <p style={{color: "#8c5e58", fontSize: "20px"}} className="font-bold">Bình luận:</p>*/}
                    {/*        <form>*/}
                    {/*            <div className="mb-3">*/}
                    {/*                <textarea className="form-control" rows="3" placeholder="Nhập bình luận của bạn..."></textarea>*/}
                    {/*            </div>*/}
                    {/*            <button type="submit" className="btn btn-primary">Gửi</button>*/}
                    {/*        </form>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default ProductDetail;
