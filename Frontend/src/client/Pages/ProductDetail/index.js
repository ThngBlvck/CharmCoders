import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getOneProduct } from "../../../services/Product";
import { getOneBrand } from "../../../services/Brand";
import { getOneCategory } from "../../../services/Category";
import { addToCart } from "../../../services/Cart";
import { getCommentsByProductId, addComment, deleteComment } from "../../../services/Comment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brandName, setBrandName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [cart, setCart] = useState({});
    const [userId, setUserId] = useState(null);
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        fetchOneProduct();
    }, [id]);

    const fetchOneProduct = async () => {
        setLoadingProduct(true);
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

            const commentsResult = await getCommentsByProductId(id);
            setComments(commentsResult);
        } catch (error) {
            console.error("Error fetching product details:", error);
            toast.error('Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.');
        } finally {
            setLoadingProduct(false);
            setLoadingComments(false);
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

    const handleAddToCart = async (productId, quantity) => {
        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`);
        try {
            const response = await addToCart(productId, quantity);
            console.log('Thêm vào giỏ hàng thành công:', response);
            Swal.fire('Thành công', 'Thêm vào giỏ hàng thành công.', 'success');
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
    };

    const handleBuyNow = async (productId, quantity) => {
        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`);
        try {
            const response = await addToCart(productId, quantity);
            Swal.fire('Thành công', 'Thêm vào giỏ hàng thành công.', 'success');
            navigate(`/cart?productId=${productId}`);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.warn("Bình luận không thể để trống!");
            return;
        }

        if (!token) {
            toast.warn('Bạn cần đăng nhập để bình luận!');
            return;
        }

        const commentData = {
            product_id: id,
            user_id: userId,
            content: newComment,
        };

        try {
            await addComment(commentData);
            setNewComment("");
            toast.success('Bình luận đã được thêm thành công!');

            const commentsResult = await getCommentsByProductId(id);
            setComments(commentsResult);
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Không thể thêm bình luận.");
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!token) {
            toast.warn('Bạn cần đăng nhập để xóa bình luận!');
            return;
        }

        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa bình luận này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
        });

        if (result.isConfirmed) {
            try {
                await deleteComment(commentId);
                toast.success('Bình luận đã được xóa thành công');

                const commentsResult = await getCommentsByProductId(id);
                setComments(commentsResult);
            } catch (error) {
                console.error("Error deleting comment:", error);
                toast.error('Bạn không thể xóa bình luận này.');
            }
        }
    };

    return (
        <div className="container my-5">
            <ToastContainer/>
            {loadingProduct ? (
                <div className="d-flex flex-column align-items-center"
                     style={{marginTop: '10rem', marginBottom: '10rem'}}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '4rem', color: '#8c5e58'}}/>
                    <p className="mt-3" style={{color: '#8c5e58', fontSize: '18px'}}>Đang tải...</p>
                </div>
            ) : product ? (
                <div className="row">
                    <div className="col-md-9 d-flex justify-start">
                        <div className="row">
                            <div className="col-md-5">
                                <img src={product.image} alt="Product" className="img-fluid rounded"
                                     style={{maxHeight: "400px", objectFit: "cover"}}/>
                            </div>
                            <div className="col-md-7 d-flex flex-column align-content-start">
                                <p className="mb-3"
                                   style={{fontSize: "26px", color: "#8c5e58", fontWeight: 'bold'}}>{product.name}</p>

                                {/* Price Display with Discount */}
                                <div className="mb-3" style={{color: "#8c5e58"}}>
                                    <strong>Giá:</strong>
                                    {product.sale_price ? (
                                        <div className="d-flex flex-column">
                        <span style={{fontSize: "20px", textDecoration: "line-through", color: "#6c4d36"}}>
                            {product.unit_price.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}
                        </span>
                                            <span style={{fontSize: "22px", color: "#f76c5e", fontWeight: "bold"}}>
                            {(product.unit_price - product.sale_price).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND"
                            })}
                        </span>
                                        </div>
                                    ) : (
                                        <span style={{fontSize: "22px", color: "#f76c5e", fontWeight: "bold"}}>
                        {product.unit_price.toLocaleString("vi-VN", {style: "currency", currency: "VND"})}
                    </span>
                                    )}
                                </div>

                                <p className="mb-3" style={{color: "#8c5e58"}}>
                                    <strong>Thương hiệu:</strong> {brandName}
                                </p>

                                <p className="mb-3" style={{color: "#8c5e58"}}>{product.weight}</p>

                                {/* Available Quantity Display */}
                                <div className="mt-2 mb-3" style={{color: "#8c5e58", fontSize: "16px"}}>
                                    <strong>Số lượng còn
                                        lại:</strong> {product.quantity} {product.quantity === 1 ? "sản phẩm" : "sản phẩm"}
                                </div>

                                {/* Quantity Input */}
                                <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                    <span style={{color: "#8c5e58", fontSize: "16px"}}><strong>Số lượng:</strong></span>
                                    <input
                                        type="number"
                                        value={cart[product.id] || 1}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        max={product.quantity}  // Limit max input value to available stock
                                        className="form-control mx-2 rounded"
                                        style={{width: "80px", fontSize: "16px"}}
                                    />
                                </div>

                                <div className="d-flex justify-content-start">
                                    {/* Display "Out of Stock" Message */}
                                    {product.quantity === 0 ? (
                                        <p className="text-danger font-bold"
                                           style={{fontSize: '16px', marginTop: '10px'}}>Hết hàng</p>
                                    ) : (
                                        <>
                                            {/* "Buy Now" Button */}
                                            <button
                                                className="btn btn-primary mr-2 font-semibold"
                                                style={{
                                                    padding: '16px',
                                                    fontSize: '14px',
                                                    color: '#442e2b',
                                                    borderRadius: '5px',
                                                    width: '150px',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                    backgroundColor: "#ffa69e",
                                                    cursor: product.quantity === 0 ? "not-allowed" : "pointer"
                                                }}
                                                onClick={() => handleBuyNow(product.id, cart[product.id] || 1)}
                                                disabled={product.quantity === 0}  // Disable button if out of stock
                                            >
                                                <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                                      style={{marginRight: "6px"}}></i>Mua ngay</p>
                                            </button>

                                            {/* "Add to Cart" Button */}
                                            <button
                                                className="btn btn-secondary font-semibold"
                                                style={{
                                                    fontSize: '14px',
                                                    padding: '16px',
                                                    borderRadius: '5px',
                                                    width: '150px',
                                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                                                }}
                                                onClick={() => handleAddToCart(product.id, cart[product.id] || 1)}
                                            >
                                                <p><i className="fa fa-shopping-basket" aria-hidden="true"
                                                      style={{marginRight: "6px"}}></i>Thêm vào giỏ</p>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="product-details" style={{marginTop: "2rem"}}>
                                <p style={{
                                    color: "#8c5e58",
                                    fontSize: "20px",
                                    marginBottom: "1rem",
                                    fontWeight: "bold"
                                }}>Thông tin chi tiết sản phẩm:</p>
                                <ul style={{paddingLeft: "20px", color: "#8c5e58"}}>
                                    <li style={{marginBottom: "8px", fontSize: "16px"}}><strong
                                        className="font-semibold">Tên sản phẩm:</strong> {product.name}</li>
                                    <li style={{marginBottom: "8px", fontSize: "16px"}}><strong
                                        className="font-semibold">Tên thương hiệu:</strong> {brandName}</li>
                                    <li style={{marginBottom: "8px", fontSize: "16px"}}><strong
                                        className="font-semibold">Tên danh mục:</strong> {categoryName}</li>
                                    <li style={{marginBottom: "8px", fontSize: "16px"}}><strong
                                        className="font-semibold">Mô tả sản phẩm:</strong> {product.content}</li>
                                </ul>
                            </div>
                        </div>
                    </div>


                    <div className="col-md-8 mt-5" style={{maxWidth: '800px', paddingLeft: '0'}}> {/* Aligned left */}
                        <form onSubmit={handleSubmitComment} className="p-3 mb-4 border rounded">
                            <div className="form-group">
                                <label htmlFor="newComment" style={{fontWeight: 'bold', fontSize: '16px'}}>Viết bình
                                    luận:</label>
                                <textarea
                                    className="form-control"
                                    id="newComment"
                                    value={newComment}
                                    onChange={handleNewCommentChange}
                                    rows="3"
                                    style={{resize: 'none'}}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">
                                Gửi bình luận
                            </button>
                        </form>

                        {loadingComments ? (
                            <div className="d-flex justify-content-center mt-5">
                                <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: '2rem'}}/>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <h4 style={{fontWeight: 'bold'}}>Bình luận</h4>
                                {comments.length > 0 ? (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="mb-3 p-3 rounded border">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div style={{maxWidth: '90%'}}>
                                                    <p style={{
                                                        fontSize: '14px',
                                                        marginBottom: '4px',
                                                        fontWeight: 'bold'
                                                    }}>{comment.user_name}</p>
                                                    <p style={{fontSize: '13px'}}>{comment.content}</p>
                                                </div>
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                    style={{cursor: 'pointer', fontSize: '14px'}}
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    title="Xóa bình luận"
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{fontSize: '13px'}}>Không có bình luận nào.</p>
                                )}
                            </div>
                        )}
                    </div>


                </div>
            ) : (
                <p>Sản phẩm không tồn tại.</p>
            )}
        </div>
    );
};

export default ProductDetail;
