import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getOneProduct } from "../../../services/Product";
import { getOneBrand } from "../../../services/Brand";
import { getOneCategory } from "../../../services/Category";
import { addToCart } from "../../../services/Cart";
import { getCommentsByProductId, addComment, deleteComment } from "../../../services/Comment";
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast
import '@fortawesome/fontawesome-free/css/all.css';

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

    const handleAddToCart = async () => {
        if (!token) {
            toast.warn('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!'); // Replace alert with toast
            return;
        }

        try {
            const quantity = cart[product.id] || 1;
            await addToCart(userId, product.id, quantity);
            toast.success('Sản phẩm đã được thêm vào giỏ hàng!'); // Replace alert with toast
            navigate('/cart');
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error('Không thể thêm sản phẩm vào giỏ hàng.'); // Replace alert with toast
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
            <ToastContainer /> {/* Add ToastContainer to your component */}
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
                                            onClick={handleAddToCart}>
                                        <p><i className="fa fa-shopping-basket" aria-hidden="true"
                                              style={{marginRight: "6px"}}></i>Thêm vào giỏ</p>
                                    </button>
                                </div>
                            </div>

                            <div className="product-details" style={{marginTop: "2rem"}}>
                                <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}}
                                   className="font-bold">Thông tin chi tiết sản phẩm:</p>
                            <div className="product-details">
                                <p style={{ color: "#8c5e58", fontSize: "20px", marginBottom: "1rem" }} className="font-bold">Thông tin chi tiết sản phẩm:</p>
                                <ul>
                                    <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                        className="font-semibold">Tên sản phẩm:</strong> {product.name}</li>
                                    <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                        className="font-semibold">Mô tả sản phẩm:</strong> {product.content}</li>
                                    <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                        className="font-semibold">Thương hiệu:</strong> {brandName}</li>
                                    <li style={{color: "#8c5e58", marginBottom: "2px"}}><strong
                                        className="font-semibold">Danh mục:</strong> {categoryName}</li>
                                </ul>
                            </div>

                            <div className="comments-section" style={{marginTop: "2rem"}}>
                                <h4 className="font-bold" style={{color: "#8c5e58"}}>Bình luận:</h4>
                                <form onSubmit={handleSubmitComment} style={{marginBottom: '1rem'}}>
        <textarea
            value={newComment}
            onChange={handleNewCommentChange}
            rows="3"
            placeholder="Nhập bình luận của bạn..."
            className="form-control"
            style={{resize: 'none', width: '100%'}}
        />
                                    <button type="submit" className="btn btn-primary mt-2">Gửi bình luận</button>
                                </form>
                                {loadingComments ? (
                                    <p>Đang tải bình luận...</p>
                                ) : (
                                    comments.length > 0 ? (
                                        <ul className="list-unstyled">
                                            {comments.map((comment) => (
                                                <li key={comment.id}
                                                    className="border-bottom mb-2 pb-2 d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <strong>{comment.user_name || "Bạn"}:</strong> {comment.content}
                                                    </div>
                                                    {/* Only show the delete icon if the logged-in user is the comment owner */}
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

                                                        <button
                                                            className="btn btn-sm"
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            title="Xóa bình luận" // Tooltip for accessibility
                                                        >
                                                            <i className="fas fa-trash"></i> {/* Font Awesome Trash Icon */}
                                                        </button>

                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Chưa có bình luận nào.</p>
                                    )
                                )}
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
                </div>
            ) : (
                <p>Không tìm thấy sản phẩm.</p>
            )}
        </div>
    );
};

export default ProductDetail;
