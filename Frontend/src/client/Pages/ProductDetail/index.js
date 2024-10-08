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
        weight: "Dung tích nè"
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
    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value, 10);
        if (!isNaN(value) && value >= 1 && value <= 99) {
            setCart(prevCart => ({
                ...prevCart,
                [product.id]: value
            }));
        }
    };

    return (
        <div className="container my-5">
            <div className="row">
                <div className="col-md-9 d-flex justify-start">
                    <div className="row">
                        {/* Hình ảnh sản phẩm bên trái */}
                        <div className="col-md-5">
                            <img
                                src="https://via.placeholder.com/500"
                                alt="Product"
                                className="img-fluid rounded"
                            />
                        </div>

                        {/* Thông tin sản phẩm ở giữa */}
                        <div className="col-md-7 d-flex flex-column align-content-start">
                            <p className="mb-3" style={{fontSize: "26px", color: "#8c5e58"}}>{product.name}</p>
                            <p className="mb-3" style={{color: "#8c5e58"}}>{product.price.toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}</p>
                            <p className="mb-3" style={{color: "#8c5e58"}}>{product.brand}</p>
                            <p className="mb-3" style={{color: "#8c5e58"}}>{product.weight}</p>

                            {/* Số lượng */}
                            <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                <span style={{color: "#8c5e58"}}>Số lượng:</span>
                                <input
                                    type="number"
                                    defaultValue={0} // Thiết lập giá trị mặc định là 0
                                    value={cart[product.id] || 1}
                                    onChange={handleQuantityChange}
                                    min="0"
                                    max="99"
                                    className="form-control mx-2 rounded"
                                    style={{width: "80px"}}
                                />
                            </div>

                            <div className="d-flex justify-content-start">
                                <button className="btn btn-primary mr-2 font-semibold"
                                        style={{padding: '16px', fontSize: '13px', color: '#442e2b'}}>
                                    <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                          style={{marginRight: "6px"}}></i>Mua
                                        ngay</p>
                                </button>
                                <button className="btn btn-secondary font-semibold" style={{fontSize: '13px'}}>
                                    <p><i className="fa fa-shopping-basket" aria-hidden="true"
                                          style={{marginRight: "6px"}}></i>Thêm
                                        vào giỏ</p>
                                </button>
                            </div>
                        </div>
                        {/* Thông tin chi tiết sản phẩm */}
                        <div className="product-details" style={{marginTop: "2rem"}}>
                            <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}}
                               className="font-bold">Thông tin chi tiết sản phẩm:</p>
                            <ul>
                                <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong className="font-semibold">Tên
                                    sản phẩm:</strong> Tên sản phẩm nè
                                </li>
                                <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong className="font-semibold">Mô
                                    tả sản phẩm:</strong> Mô tả sản phẩm nè
                                </li>
                                <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong className="font-semibold">Thành
                                    phần:</strong> Thành phần nè
                                </li>
                                <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong className="font-semibold">Thương
                                    hiệu:</strong> Thương hiệu nè
                                </li>
                                <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong className="font-semibold">Xuất
                                    xứ:</strong> Xuất xứ nè
                                </li>
                                <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong className="font-semibold">Dung
                                    tích:</strong> Dung tích nè
                                </li>
                            </ul>
                        </div>

                        {/* Form bình luận */}
                        <div className="row mt-5">
                            <div className="col-12">
                            <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}}
                                   className="font-bold">Thêm bình luận</p>
                                <form onSubmit={handleAddComment}>
                                    <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Nhập bình luận của bạn..."
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
                                <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}}
                                   className="font-bold">Bình luận</p>
                                {commentsList.length > 0 ? (
                                    <ul className="list-group">
                                        {commentsList.map((comment, index) => (
                                            <li key={index} className="list-group-item d-flex align-items-start">
                                                <img src={comment.avatar} alt="Avatar" className="rounded-circle me-2"
                                                     style={{width: '50px', height: '50px'}}/>
                                                <div>
                                                    <strong>{comment.name}</strong>
                                                    <p style={{color: "#8c5e58"}}>{comment.text}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p style={{color: "#8c5e58"}}>Chưa có bình luận nào.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 ô cam kết bên phải theo chiều dọc */}
                <div className="col-md-3 d-flex justify-end">
                    <div className="row text-center d-flex flex-column">
                        {/* Cam kết 1 */}
                        <div className="col mb-3">
                            <div className="p-4 d-flex flex-column align-items-center" style={{
                                maxWidth: "250px",
                                backgroundColor: 'white'
                            }}>
                                <img src="https://via.placeholder.com/150x150" alt="Thanh toán khi nhận hàng"
                                     className="img-fluid mb-3 rounded"
                                     style={{width: '150px', objectFit: 'cover'}}/>
                                <p style={{color: '#8c5e58'}} className="font-bold">Thanh toán khi nhận hàng</p>
                            </div>
                        </div>

                        {/* Cam kết 2 */}
                        <div className="col mb-3">
                            <div className="p-4 d-flex flex-column align-items-center" style={{
                                maxWidth: "250px",
                                backgroundColor: 'white'
                            }}>
                                <img src="https://via.placeholder.com/150x150" alt="Thương hiệu uy tín toàn cầu"
                                     className="img-fluid mb-3 rounded"
                                     style={{width: '150px', objectFit: 'cover'}}/>
                                <p style={{color: '#8c5e58'}} className="font-bold">Thương hiệu uy tín toàn cầu</p>
                            </div>
                        </div>

                        {/* Cam kết 3 */}
                        <div className="col mb-3">
                            <div className="p-4 d-flex flex-column align-items-center" style={{
                                maxWidth: "250px",
                                backgroundColor: 'white'
                            }}>
                                <img src="https://via.placeholder.com/150x150" alt="30 ngày đổi trả miễn phí"
                                     className="img-fluid mb-3 rounded"
                                     style={{width: '150px', objectFit: 'cover'}}/>
                                <p style={{color: '#8c5e58'}} className="font-bold">30 ngày đổi trả miễn phí</p>
                            </div>
                        </div>

                        {/* Cam kết 4 */}
                        <div className="col">
                            <div className="p-4 d-flex flex-column align-items-center" style={{
                                maxWidth: "250px",
                                backgroundColor: 'white'
                            }}>
                                <img src="https://via.placeholder.com/150x150" alt="Sản phẩm chính hãng 100%"
                                     className="img-fluid mb-3 rounded"
                                     style={{width: '150px', objectFit: 'cover'}}/>
                                <p style={{color: '#8c5e58'}} className="font-bold">Sản phẩm chính hãng 100%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default ProductDetail;
