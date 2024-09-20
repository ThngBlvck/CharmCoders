import React, {useState} from 'react';
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";


const ProductDetail = () => {
    // State để quản lý bình luận
    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);
    const [cart, setCart] = useState({});

    // Thông tin sản phẩm giả lập
    const product = {
        id: 1,
        name: "Tên sản phẩm",
        price: 100000,
        brand: "Thương hiệu nè",
        weight: "Khối lượng nè"
    };

    // Hàm xử lý khi thêm bình luận
    const handleAddComment = (e) => {
        e.preventDefault();
        if (comment.trim() !== '') {
            setCommentsList([...commentsList, {
                name: "Người dùng",
                text: comment,
                avatar: "https://via.placeholder.com/50"
            }]);
            setComment('');
        }
    };

    // Tăng giảm số lượng
    const MAX_QUANTITY = 99;
    const handleAddToCart = () => {
        setCart((prevCart) => {
            const currentQuantity = prevCart[product.id] || 0;
            if (currentQuantity < MAX_QUANTITY) {
                return {
                    ...prevCart,
                    [product.id]: currentQuantity + 1,
                };
            }
            return prevCart;
        });
    };

    const handleRemoveFromCart = () => {
        setCart((prevCart) => {
            const newCart = {...prevCart};
            if (newCart[product.id] > 1) {
                newCart[product.id] -= 1;
            } else {
                delete newCart[product.id];
            }
            return newCart;
        });
    };

    return (
        <div className="container my-5">
            <div className="row">
                {/* Hình ảnh sản phẩm bên trái */}
                <div className="col-md-6">
                    <img
                        src="https://via.placeholder.com/500"
                        alt="Product"
                        className="img-fluid"
                    />
                </div>

                {/* Thông tin sản phẩm bên phải */}
                <div className="col-md-6">
                    <h1 className="mb-3">{product.name}</h1>
                    <h3 className="text-success mb-3">{product.price}đ</h3>
                    <p>{product.brand}</p>
                    <p>{product.weight}</p>

                    {cart[product.id] && (
                        <div className="mt-2 d-flex align-items-center">
                            <span>Số lượng:</span>
                            <button className="btn btn-danger mx-2" onClick={handleRemoveFromCart}>-</button>
                            <span>{cart[product.id]}</span>
                            <button className="btn btn-success mx-2" onClick={handleAddToCart}>+</button>
                        </div>
                    )}
                    <button className="btn btn-primary mb-4" onClick={handleAddToCart}>Thêm vào giỏ</button>

                    {/* Thông tin chi tiết sản phẩm */}
                    <div className="product-details">
                        <h4>Thông tin chi tiết sản phẩm:</h4>
                        <ul>
                            <li><strong>Tên sản phẩm:</strong> Tên sản phẩm nè</li>
                            <li><strong>Giá sản phẩm:</strong> Giá sản phẩm nè</li>
                            <li><strong>Thương hiệu:</strong> Thương hiệu nè</li>
                            <li><strong>Khối lượng:</strong> Khối lượng nè</li>
                            <li><strong>Mô tả sản phẩm:</strong> Mô tả sản phẩm nè</li>
                            <li><strong>Thành phần:</strong> Thành phần nè</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Form bình luận */}
            <div className="row mt-5">
                <div className="col-12">
                    <h3>Thêm bình luận</h3>
                    <form onSubmit={handleAddComment}>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Nhập bình luận của bạn"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-secondary">
                            Gửi bình luận
                        </button>
                    </form>
                </div>
            </div>

            {/* Hiển thị danh sách bình luận */}
            <div className="row mt-4">
                <div className="col-12">
                    <h4>Bình luận</h4>
                    {commentsList.length > 0 ? (
                        <ul className="list-group">
                            {commentsList.map((comment, index) => (
                                <li key={index} className="list-group-item d-flex align-items-start">
                                    <img src={comment.avatar} alt="Avatar" className="rounded-circle me-2"
                                         style={{width: '50px', height: '50px'}}/>
                                    <div>
                                        <strong>{comment.name}</strong>
                                        <p>{comment.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Chưa có bình luận nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;