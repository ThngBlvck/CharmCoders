import React, { useEffect, useState,useRef  } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import { getOneProduct, getRelatedProducts  } from "../../../services/Product";
import { getOneBrand } from "../../../services/Brand";
import { getOneCategory } from "../../../services/Category";
import { addToCart } from "../../../services/Cart";
import { getCommentsByProductId, addComment, deleteComment } from "../../../services/Comment";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.css';
import "../../../assets/styles/css/productdt/index.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faTrash } from "@fortawesome/free-solid-svg-icons";
import '@fontsource/roboto';
import Swal from "sweetalert2";
import Slider from "react-slick";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]); // Sản phẩm liên quan
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
    const sliderRef = useRef(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        fetchOneProduct();
    }, [id]);



    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        draggable: false, // Tắt khả năng kéo
        swipe: false,     // Tắt khả năng vuốt trên thiết bị di động
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 480, settings: { slidesToShow: 1 } },
        ],
    };
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

            const relatedProductsResult = await getRelatedProducts(id); // Lấy sản phẩm liên quan
            setRelatedProducts(relatedProductsResult.related_products);
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải sản phẩm.');
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
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.',
                confirmButtonText: 'Đăng nhập',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Chuyển hướng đến trang đăng nhập
                }
            });
            return;
        }

        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`);
        try {
            const response = await addToCart(productId, quantity);
            console.log('Thêm vào giỏ hàng thành công:', response);

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Sản phẩm đã được thêm vào giỏ hàng.',
                confirmButtonText: 'OK',
            });
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);

            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.',
                confirmButtonText: 'OK',
            });
        }
    };

    const handleBuyNow = async (productId, quantity) => {
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để mua sản phẩm.',
                confirmButtonText: 'Đăng nhập',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Chuyển hướng đến trang đăng nhập
                }
            });
            return;
        }

        console.log(`Adding to cart with data: {product_id: ${productId}, quantity: ${quantity}}`);
        try {
            const response = await addToCart(productId, quantity);

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Sản phẩm đã được thêm vào giỏ hàng.',
                confirmButtonText: 'OK',
            }).then(() => {
                navigate(`/cart?productId=${productId}`);
            });
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);

            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.',
                confirmButtonText: 'OK',
            });
        }
    };


    const handleNewCommentChange = (e) => {
        const value = e.target.value;

        if (value.length > 500) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Nội dung bình luận không được vượt quá 500 ký tự.',
                confirmButtonText: 'OK',
            });
            return;
        }

        setNewComment(value);
    };


    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để bình luận.',
                confirmButtonText: 'Đăng nhập',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Chuyển hướng đến trang đăng nhập
                }
            });
            return;
        }

        if (!newComment.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Bình luận không thể để trống!',
                confirmButtonText: 'OK',
            });
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

            Swal.fire({
                icon: 'success',
                title: 'Thành công',
                text: 'Bình luận đã được thêm thành công!',
                confirmButtonText: 'OK',
            });

            const commentsResult = await getCommentsByProductId(id);
            setComments(commentsResult);
        } catch (error) {
            console.error("Error adding comment:", error);

            Swal.fire({
                icon: 'error',
                title: 'Lỗi',
                text: 'Không thể thêm bình luận.',
                confirmButtonText: 'OK',
            });
        }
    };
    const handleDeleteComment = async (commentId) => {
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Cảnh báo',
                text: 'Bạn cần đăng nhập để xóa bình luận!',
            });
            return;
        }

        const result = await Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa bình luận này?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Có',
            cancelButtonText: 'Không',
            confirmButtonColor: '#e74c3c', // Màu cho nút xác nhận
            cancelButtonColor: '#6c757d', // Màu cho nút hủy
        });

        if (result.isConfirmed) {
            try {
                await deleteComment(commentId);

                Swal.fire({
                    icon: 'success',
                    title: 'Thành công',
                    text: 'Bình luận đã được xóa thành công!',
                });

                // Lấy lại danh sách bình luận sau khi xóa
                const commentsResult = await getCommentsByProductId(id);
                setComments(commentsResult);
            } catch (error) {
                console.error("Error deleting comment:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Lỗi',
                    text: 'Bạn không thể xóa bình luận này.',
                });
            }
        }
    };


    return (
        <div className="container my-5">
            <ToastContainer/>
            {loadingProduct ? (
                <div className="d-flex flex-column align-items-center"
                     style={{marginTop: "10rem", marginBottom: "10rem"}}>
                    <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: "4rem", color: "#8c5e58"}}/>
                    <p className="mt-3" style={{color: "#8c5e58", fontSize: "18px"}}>Đang tải...</p>
                </div>
            ) : product ? (
                <div>
                    <div className="row">
                        {/* Phần chi tiết sản phẩm */}
                        <div className="col-md-9">
                            <div className="row">
                                <div className="col-md-5">
                                    <img src={product.image} alt="Product" className="img-fluid rounded"
                                         style={{maxHeight: "400px", objectFit: "cover"}}/>
                                </div>
                                <div className="col-md-7 d-flex flex-column align-content-start">
                                    <p className="mb-3"
                                       style={{fontSize: "26px", color: "#8c5e58", fontWeight: "bold"}}>
                                        {product.name}
                                    </p>
                                    {/* Hiển thị giá */}
                                    <div className="mb-3" style={{color: "#8c5e58"}}>
                                        <strong>Giá:</strong>
                                        {product.sale_price ? (
                                            <div className="d-flex flex-column">
                                        <span style={{
                                            fontSize: "20px",
                                            textDecoration: "line-through",
                                            color: "#6c4d36"
                                        }}>
                                            {product.unit_price.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND"
                                            })}
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
                                        {product.unit_price.toLocaleString("vi-VN", {
                                            style: "currency",
                                            currency: "VND"
                                        })}
                                    </span>
                                        )}
                                    </div>
                                    {/* Thông tin thêm */}
                                    <p className="mb-3" style={{color: "#8c5e58"}}>
                                        <strong>Thương hiệu:</strong> {brandName}
                                    </p>
                                    <p className="mb-3" style={{color: "#8c5e58"}}>{product.weight}</p>
                                    {/* Số lượng và nút hành động */}
                                    <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                <span style={{color: "#8c5e58", fontSize: "16px"}}>
                                    <strong>Số lượng:</strong>
                                </span>
                                        <input
                                            type="number"
                                            value={cart[product.id] || 1}
                                            onChange={handleQuantityChange}
                                            min="1"
                                            max={product.quantity}
                                            className="form-control mx-2 rounded"
                                            style={{width: "80px", fontSize: "16px"}}
                                        />
                                    </div>
                                    {/* Nút hành động */}
                                    <div className="d-flex justify-content-start">
                                        {product.quantity === 0 ? (
                                            <p className="text-danger font-bold" style={{
                                                fontSize: "16px",
                                                marginTop: "10px",
                                                paddingLeft: "10px",
                                                marginRight: "10px"
                                            }}>
                                                Hết hàng
                                            </p>
                                        ) : (
                                            <>
                                                <button
                                                    className="btn btn-primary mr-2 font-semibold"
                                                    style={{
                                                        padding: "16px",
                                                        fontSize: "14px",
                                                        color: "#442e2b",
                                                        borderRadius: "5px",
                                                        width: "150px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                        backgroundColor: "#ffa69e",
                                                        cursor: "pointer",
                                                        marginRight: "10px",
                                                    }}
                                                    onClick={() => handleBuyNow(product.id, cart[product.id] || 1)}
                                                >
                                                    <p>
                                                        <i className="fa fa-shopping-cart" aria-hidden="true"
                                                           style={{marginRight: "6px"}}></i>
                                                        Mua ngay
                                                    </p>
                                                </button>
                                                <button
                                                    className="btn btn-secondary font-semibold"
                                                    style={{
                                                        fontSize: "14px",
                                                        padding: "16px",
                                                        borderRadius: "5px",
                                                        width: "150px",
                                                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                                    }}
                                                    onClick={() => handleAddToCart(product.id, cart[product.id] || 1)}
                                                >
                                                    <p>
                                                        <i className="fa fa-shopping-basket" aria-hidden="true"
                                                           style={{marginRight: "6px"}}></i>
                                                        Thêm vào giỏ
                                                    </p>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {/* Phần bình luận */}
                            <div className="comments-section mt-5">
                                <h5 style={{fontWeight: "bold", color: "#8c5e58"}}>Bình luận</h5>
                                <form onSubmit={handleSubmitComment} className="p-3 mb-4 border rounded">
                                    <div className="form-group">
                                        <label htmlFor="newComment" style={{fontWeight: "bold", fontSize: "16px"}}>Viết
                                            bình luận:</label>
                                        <textarea className="form-control" id="newComment" value={newComment}
                                                  onChange={(e) => setNewComment(e.target.value)} rows="3"
                                                  style={{resize: "none"}}/>
                                    </div>
                                    <button type="submit" className="btn btn-primary mt-2">Gửi bình luận</button>
                                </form>
                                {loadingComments ? (
                                    <div className="d-flex justify-content-center mt-5">
                                        <FontAwesomeIcon icon={faSpinner} spin style={{fontSize: "2rem"}}/>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        {comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="mb-3 p-3 rounded border">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <p style={{
                                                                fontSize: "14px",
                                                                marginBottom: "4px",
                                                                fontWeight: "bold"
                                                            }}>{comment.user_name}</p>
                                                            <p style={{fontSize: "13px"}}>{comment.content}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p style={{fontSize: "13px"}}>Không có bình luận nào.</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


                    {/* Sản phẩm liên quan */}
                    <div className="related-products mt-5" style={{paddingTop: "20px", position: "relative"}}>
                        <h5
                            style={{
                                fontFamily: "'Roboto', sans-serif",
                                fontSize: "20px",
                                fontWeight: "700",
                                color: "#8c5e58",
                                marginBottom: "20px",
                                textAlign: "left",
                            }}
                        >
                            Sản phẩm liên quan
                        </h5>
                        {/* Slider */}
                        <div
                            style={{
                                position: "relative",
                                padding: "0 30px", // Thêm khoảng cách ở hai bên slider
                            }}
                        >
                            <Slider
                                {...sliderSettings}
                                ref={sliderRef} // Tham chiếu để điều khiển slider bằng nút tùy chỉnh
                            >
                                {relatedProducts.length > 0 ? (
                                    relatedProducts.map((relatedProduct) => (
                                        <div
                                            key={relatedProduct.id}
                                            style={{
                                                padding: "10px",
                                                // Khoảng cách giữa các sản phẩm
                                            }}
                                        >
                                            <div
                                                className="p-3 border rounded"
                                                style={{
                                                    backgroundColor: "#fff",
                                                    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                                                    borderRadius: "12px", // Góc bo tròn
                                                    textAlign: "center",
                                                    transition: "transform 0.3s ease",
                                                    height: "300px", // Tăng chiều cao tổng thể của box
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "space-between",
                                                }}
                                                onClick={() => navigate(`/products/${relatedProduct.id}`)}
                                            >
                                                <img
                                                    src={relatedProduct.image}
                                                    alt={relatedProduct.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "180px", // Tăng chiều cao hình ảnh
                                                        objectFit: "cover",
                                                        borderRadius: "10px", // Góc bo hình ảnh
                                                        marginBottom: "10px",
                                                        transition: "transform 0.3s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.target.style.transform = "scale(1.05)";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = "scale(1)";
                                                    }}
                                                />
                                                <p
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#8c5e58",
                                                        fontWeight: "500",
                                                        margin: "0 0 5px 0",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    {relatedProduct.name}
                                                </p>
                                                <p
                                                    style={{
                                                        fontSize: "14px",
                                                        color: "#e74c3c",
                                                        fontWeight: "600",
                                                        margin: "0",
                                                    }}
                                                >
                                                    {relatedProduct.sale_price
                                                        ? relatedProduct.sale_price.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })
                                                        : relatedProduct.unit_price.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p
                                        style={{
                                            fontSize: "14px",
                                            color: "#8c5e58",
                                            textAlign: "center",
                                        }}
                                    >
                                        Không có sản phẩm liên quan.
                                    </p>
                                )}
                            </Slider>
                            {/* Nút Previous */}
                            <button
                                className="btn btn-outline-secondary"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "-20px",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    width: "50px",
                                    height: "50px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                }}
                                onClick={() => sliderRef.current.slickPrev()}
                            >
                                <i className="fa fa-chevron-left" style={{fontSize: "18px", color: "#8c5e58"}}></i>
                            </button>

                            {/* Nút Next */}
                            <button
                                className="btn btn-outline-secondary"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    right: "-20px",
                                    transform: "translateY(-50%)",
                                    zIndex: 10,
                                    backgroundColor: "#fff",
                                    borderRadius: "50%",
                                    width: "50px",
                                    height: "50px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                }}
                                onClick={() => sliderRef.current.slickNext()}
                            >
                                <i className="fa fa-chevron-right" style={{fontSize: "18px", color: "#8c5e58"}}></i>
                            </button>
                        </div>
                    </div>


                </div>
            ) : (
                <p>Sản phẩm không tồn tại.</p>
            )}
        </div>


    );
};

export default ProductDetail;
