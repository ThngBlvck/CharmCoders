import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getOneProduct} from "../../../services/Product";
import {getOneBrand} from "../../../services/Brand";
import {getOneCategory} from "../../../services/Category";
import {addToCart} from "../../../services/Cart";
import {getCommentsByProductId, addComment, deleteComment} from "../../../services/Comment";
import {ToastContainer, toast} from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import '@fortawesome/fontawesome-free/css/all.css';

const ProductDetail = () => {
    const {id} = useParams();
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
            toast.error('Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.'); // Replace alert with toast
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
        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`); // Kiểm tra giá trị
        try {
            const response = await addToCart(productId, quantity);
            console.log('Thêm vào giỏ hàng thành công:', response);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
        }
    };


    const handleBuyNow = () => {
        if (!token) {
            toast.warn('Bạn cần đăng nhập để mua ngay sản phẩm!'); // Replace alert with toast
            return;
        }

        navigate(`/checkout?productId=${product.id}`);
    };

    const handleNewCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            toast.warn("Bình luận không thể để trống!"); // Replace alert with toast
            return;
        }

        if (!token) {
            toast.warn('Bạn cần đăng nhập để bình luận!'); // Replace alert with toast
            return;
        }

        const newCommentEntry = {
            content: newComment,
            user_id: userId,
            id: Date.now(), // For local tracking; you should use the ID from the server if available
        };

        try {
            // Add the new comment to the state first for instant UI feedback
            setComments(prevComments => [...prevComments, newCommentEntry]);
            setNewComment("");

            const commentData = {
                product_id: id,
                user_id: userId,
                content: newComment,
            };

            // Send the comment to the server
            await addComment(commentData);

            // Notify user of success
            toast.success('Bình luận đã được thêm thành công!'); // Replace alert with toast

        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Không thể thêm bình luận."); // Replace alert with toast
            // Remove the comment from the local state if the add operation fails
            setComments(prevComments => prevComments.filter(comment => comment.id !== newCommentEntry.id));
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!token) {
            toast.warn('Bạn cần đăng nhập để xóa bình luận!'); // Replace alert with toast
            return;
        }

        if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
            try {
                await deleteComment(commentId);
                setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
                toast.success('Bình luận đã được xóa thành công'); // Replace alert with toast
            } catch (error) {
                console.error("Error deleting comment:", error);
                toast.error('Bạn không thể xóa bình luận này.'); // Replace alert with toast
            }
        }
    };

    return (
        <div className="container my-5">
            <ToastContainer/> {/* Add ToastContainer to your component */}
            {loadingProduct ? (
                <p>Đang tải thông tin sản phẩm...</p>
            ) : product ? (
                <div className="row">
                    <div className="col-md-9 d-flex justify-start">
                        <div className="row">
                            <div className="col-md-5">
                                <img src={product.image} alt="Product" className="img-fluid rounded"/>
                            </div>
                            <div className="col-md-7 d-flex flex-column align-content-start">
                                <p className="mb-3" style={{fontSize: "26px", color: "#8c5e58"}}>{product.name}</p>
                                <p className="mb-3"
                                   style={{color: "#8c5e58"}}>{product.unit_price.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}</p>
                                <p className="mb-3" style={{color: "#8c5e58"}}>{brandName}</p>
                                <p className="mb-3" style={{color: "#8c5e58"}}>{product.weight}</p>

                                <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                    <span style={{color: "#8c5e58"}}>Số lượng:</span>
                                    <input
                                        type="number"
                                        value={cart[product.id] || 1}
                                        onChange={handleQuantityChange}
                                        min="1"
                                        max="99"
                                        className="form-control mx-2 rounded"
                                        style={{width: "80px"}}
                                    />
                                </div>

                                <div className="d-flex justify-content-start">
                                    <button className="btn btn-primary mr-2 font-semibold"
                                            style={{padding: '16px', fontSize: '13px', color: '#442e2b'}}
                                            onClick={handleBuyNow}>
                                        <p><i className="fa fa-shopping-cart" aria-hidden="true"
                                              style={{marginRight: "6px"}}></i>Mua ngay</p>
                                    </button>
                                    <button className="btn btn-primary font-semibold"
                                            style={{fontSize: '13px'}}
                                            onClick={() => handleAddToCart(product.id, cart[product.id] || 1)}>
                                        <p><i className="fa fa-shopping-basket" aria-hidden="true"
                                              style={{marginRight: "6px"}}></i>Thêm
                                            vào giỏ</p>
                                    </button>

                                </div>
                            </div>

                            <div className="product-details" style={{marginTop: "2rem"}}>
                                <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}}
                                   className="font-bold">Thông tin chi tiết sản phẩm:</p>
                                <div className="product-details">
                                    <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}}
                                       className="font-bold">Thông tin chi tiết sản phẩm:</p>
                                    <ul>
                                        <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                            className="font-semibold">Tên sản phẩm:</strong> {product.name}</li>
                                        <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                            className="font-semibold">Giá:</strong> {product.unit_price.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND",
                                        })}</li>
                                        <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                            className="font-semibold">Danh mục:</strong> {categoryName}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <h5 style={{color: "#8c5e58"}}>Bình luận:</h5>
                        <form onSubmit={handleSubmitComment}>
                            <div className="form-group">
                                <textarea className="form-control"
                                          value={newComment}
                                          onChange={handleNewCommentChange}
                                          rows="3"
                                          placeholder="Nhập bình luận của bạn..."></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Gửi bình luận</button>
                        </form>
                        {loadingComments ? (
                            <p>Đang tải bình luận...</p>
                        ) : (
                            <ul className="list-unstyled mt-3">
                                {comments.map(comment => (
                                    <li key={comment.id} className="border-bottom mb-2">
                                        <p className="font-weight-bold">{comment.user_id}:</p>
                                        <p>{comment.content}</p>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(comment.id)}>
                                            Xóa
                                        </button>
                                    </li>
                                ))}
                            </ul>
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