import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getOneProduct, getRelatedProducts, getHotProducts} from "../../../services/Product";
import {getOneBrand} from "../../../services/Brand";
import {getOneCategory} from "../../../services/Category";
import {addToCart} from "../../../services/Cart";
import {addReview, getReviews, updateReview,  getReviewById} from "../../../services/Review";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.css';
import "../../../assets/styles/css/productdt/index.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import '@fontsource/roboto';
import Swal from "sweetalert2";
import Slider from "react-slick";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const ProductDetail = () => {
    const {id} = useParams();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]); // Sản phẩm liên quan
    const [brandName, setBrandName] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [cart, setCart] = useState({});
    const [userId, setUserId] = useState(null);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [loadingReviews, setLoadingReviews] = useState(true);  // Loading reviews state
    const [reviews, setReviews] = useState([]); // Reviews data
    const [hotProducts, setHotProducts] = useState([]); // Hot products data
    const [rating, setRating] = useState(0); // Product rating
    const [comment, setComment] = useState(""); // Nhận xét của người dùng
    const [editRating, setEditRating] = useState(0);  // Stores the rating for editing
    const [editComment, setEditComment] = useState("");  // Stores the comment for editing
    const [editingReview, setEditingReview] = useState(false);  // Tracks if the user is editing a review
    const [userName, setUserName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingReviewId, setEditingReviewId] = useState(null);  // Store the id of the review being edited
    const [review_id, setReview_id] = useState(null);

    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
        fetchOneProduct();

    }, [id]);


    const sliderSettings = {
        dots: false,
        infinite: relatedProducts.length > 1, // Chỉ cho phép infinite nếu có nhiều hơn 1 item
        speed: 500,
        slidesToShow: relatedProducts.length === 1 ? 1 : Math.min(relatedProducts.length, 5), // Nếu chỉ có 1 item, hiển thị 1 item
        slidesToScroll: 1,
        arrows: relatedProducts.length > 1, // Chỉ hiển thị nút điều hướng nếu có nhiều hơn 1 sản phẩm
        autoplay: relatedProducts.length >= 5, // Chỉ tự động chạy khi có 5 item trở lên
        autoplaySpeed: 2000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2, // Tối đa hiển thị 2 item cho kích thước màn hình nhỏ hơn 768px
                },
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1, // Luôn hiển thị 1 item cho kích thước màn hình nhỏ hơn 480px
                },
            },
        ],
    };





    const fetchOneProduct = async () => {
        setLoadingProduct(true);
        try {
            // Lấy chi tiết sản phẩm
            const result = await getOneProduct(id);
            setProduct(result);

            // Lấy thương hiệu
            if (result.brand_id) {
                const brandResult = await getOneBrand(result.brand_id);
                setBrandName(brandResult.name);
            }

            // Lấy danh mục
            if (result.category_id) {
                const categoryResult = await getOneCategory(result.category_id);
                setCategoryName(categoryResult.name);
            }

            // Fetch related products
            const relatedProductsResult = await getRelatedProducts(id);
            setRelatedProducts(relatedProductsResult.related_products);

            // Fetch hot products
            const hotProductsResult = await getHotProducts();
            if (hotProductsResult && hotProductsResult.hot_products) {
                setHotProducts(hotProductsResult.hot_products);
            } else {
                toast.warning('No hot products found.');
            }

            // Fetch product reviews
            const reviewsData = await getReviews(id);
            setReviews(reviewsData);

        } catch (error) {
            // toast.error('There was an error loading the product.');
            console.error('Error fetching product details:', error);
        } finally {
            setLoadingProduct(false);
            setLoadingReviews(false);  // Set reviews loading state to false after data is fetched
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
            toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            toast.error("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
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
            toast.success("Sản phẩm đã được thêm vào giỏ hàng.");
            navigate(`/cart?productId=${productId}`);
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            toast.error("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const userId = localStorage.getItem("userId");

        try {
            // Kiểm tra đăng nhập
            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Yêu cầu đăng nhập',
                    text: 'Bạn cần đăng nhập để bình luận. Vui lòng đăng nhập để tiếp tục.',
                    confirmButtonText: 'Đăng nhập',
                }).then(() => navigate("/login"));
                setIsSubmitting(false);
                return;
            }

            // Kiểm tra đánh giá và nhận xét
            if (rating === 0 || comment === "") {
                toast.error("Vui lòng cung cấp cả đánh giá sao và nhận xét để tiếp tục.");
                setIsSubmitting(false);
                return;
            }

            const reviewData = { rating, comment, product_id: product.id, user_id: userId };
            let response;

            if (editingReviewId) {
                // Cập nhật đánh giá
                response = await updateReview(editingReviewId, reviewData);
                if (response && response.review) {
                    setReviews(reviews.map((review) => review.id === editingReviewId ? response.review : review));
                    resetForm();
                    toast.success("Đánh giá đã được chỉnh sửa thành công!");
                } else {
                    throw new Error("Cập nhật đánh giá thất bại.");  // Manually throw an error for failed update
                }
            } else {
                // Thêm mới đánh giá
                response = await addReview(reviewData);
                if (response?.review) {
                    setReviews([...reviews, response.review]);
                    resetForm();
                    toast.success("Đánh giá thành công! Cảm ơn bạn đã chia sẻ ý kiến.");
                } else {
                    throw new Error("Thêm mới đánh giá thất bại.");  // Manually throw an error for failed addition
                }
            }
        } catch (error) {
            console.error("Error during review submission:", error);
            toast.error(`${error.message || 'Vui lòng thử lại sau.'}`);  // Display specific error message
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingReview(false);
        setEditingReviewId(null);
        setRating(0);
        setComment("");
    };


    const handleEditReview = (reviewId) => {
        // Cập nhật reviewId khi chọn chỉnh sửa
        setEditingReviewId(reviewId);
        setEditingReview(true); // Kích hoạt chế độ chỉnh sửa
        const review = reviews.find(r => r.id === reviewId);
        setRating(review.rating);  // Thiết lập lại rating
        setComment(review.comment);  // Thiết lập lại comment
    };


    const handleCancelEdit = () => {
        setEditingReview(null); // Hủy chỉnh sửa
        setRating(0);
        setComment('');
    };


    return (
        <div className="container my-5">
            {loadingProduct ? (
                <div>
                    <div className="row">
                        {/* Cột Chi Tiết Sản Phẩm */}
                        <div className="col-md-9">
                            <div className="row">
                                {/* Hình ảnh sản phẩm */}
                                <div className="col-md-5">
                                    <Skeleton height={300} width="100%"/>
                                </div>
                                {/* Nội dung chi tiết sản phẩm */}
                                <div className="col-md-7 d-flex flex-column align-content-start">
                                    {/* Tên sản phẩm */}
                                    <p className="mb-2 text-dGreen fs-26 font-bold">
                                        <Skeleton width={200} height={30}/>
                                    </p>

                                    {/* Giá sản phẩm */}
                                    <div className="mb-2 text-dGreen">
                                        <Skeleton width={100} height={20}/>
                                        <div className="d-flex flex-row align-items-center">
                                            <Skeleton width={100} height={20} className="mr-2"/>
                                            <Skeleton width={100} height={20}/>
                                        </div>
                                    </div>

                                    {/* Input số lượng */}
                                    <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                        <span className="text-dGreen fs-16">
                                            <Skeleton width={100} height={20}/>
                                        </span>
                                        <Skeleton
                                            width={50}
                                            height={35}
                                            className="mx-2 rounded fs-16 w-16"
                                        />
                                    </div>

                                    {/* Nút thêm vào giỏ và mua ngay */}
                                    <div className="d-flex justify-content-start">
                                        <Skeleton width={100} height={40} className="mr-2"/>
                                        <Skeleton width={100} height={40}/>
                                    </div>
                                </div>
                                {/* Thông tin chi tiết sản phẩm */}
                                <div className="product-details">
                                    <Skeleton height={20} width="100%"/>
                                    <ul>
                                        <li><Skeleton height={20} width="100%"/></li>
                                        <li><Skeleton height={20} width="100%"/></li>
                                        <li><Skeleton height={20} width="100%"/></li>
                                        <li><Skeleton height={20} width="100%"/></li>
                                        <li></li>
                                    </ul>
                                </div>
                            </div>


                        </div>
                        {/* Cột Sản Phẩm Hot */}
                        <div className="col-md-3">
                            <div className="hot-products-section p-3 border rounded shadow bg-white">
                                <p className="fs-20 font-bold text-dGreen mb-2 text-center">
                                    <Skeleton height={20} width="100%"/>
                                </p>
                                {hotProducts?.length > 0 ? (
                                    hotProducts.map((hotProduct) => (
                                        <div
                                            key={hotProduct.id}
                                            className="d-flex align-items-center mb-3 hot-product-item p-1 rounded product-hot shadow"
                                            onClick={() => navigate(`/products/${hotProduct.id}`)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "scale(1.02)";
                                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <Skeleton height={20} width="100%"/>
                                            <div>
                                                <p className="fs-14 font-bold m-0 text-dGreen overflow-hidden whitespace-nowrap name-pro-hot"
                                                   title={hotProduct.name}>
                                                    <Skeleton height={20} width="100%"/>
                                                </p>
                                                <p className="fs-14 text-dGreen font-semibold">
                                                    <Skeleton height={20} width="100%"/>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <Skeleton height={60} width="100%"/>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            ) : product ? (
                <div>
                    <div className="row">
                        {/* Cột Chi Tiết Sản Phẩm */}
                        <div className="col-md-9">
                            <div className="row">
                                {/* Hình ảnh sản phẩm */}
                                <div className="col-md-5">
                                    <img src={product.image} alt="Product" className="img-fluid rounded img-product"/>
                                </div>
                                {/* Nội dung chi tiết sản phẩm */}
                                <div className="col-md-7 d-flex flex-column align-content-start">
                                    <p className="mb-2 text-dGreen fs-26 font-bold">
                                        {product.name}
                                    </p>
                                    {/* Giá sản phẩm */}
                                    <div className="mb-2 text-dGreen">
                                        <strong>Giá: </strong>
                                        {product.sale_price ? (
                                            <div className="d-flex flex-row align-items-center">
                                                <span className="fs-16 text-decoration-line-through text-dGreen mr-2">
                                                    {product.unit_price.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </span>
                                                <span className="fs-16 salePr font-bold">
                                                    {(product.sale_price).toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="fs-16 text-dGreen font-bold">
                                                {product.unit_price.toLocaleString("vi-VN", {
                                                    style: "currency",
                                                    currency: "VND",
                                                })}
                                            </span>
                                        )}
                                    </div>
                                    {/* Chọn số lượng và nút hành động */}
                                    <div className="mt-2 d-flex justify-content-start align-items-center mb-3">
                                    <span className="text-dGreen fs-16">
                                        <strong>Số lượng:</strong>
                                    </span>
                                        <input
                                            type="number"
                                            value={cart[product.id] || 1}
                                            onChange={handleQuantityChange}
                                            min="1"
                                            max={product.quantity}
                                            className="form-control mx-2 rounded fs-16 w-16"
                                        />
                                    </div>
                                    {/* Nút thêm vào giỏ và mua ngay */}
                                    <div className="d-flex justify-content-start">
                                        {product.quantity === 0 ? (
                                            <p className="text-danger font-bold fs-16 mt-1 pl-1 mr-1">
                                                Hết hàng
                                            </p>
                                        ) : (
                                            <>
                                                <button className="butn mr-2 w-25 rounded font-semibold shadow"
                                                        onClick={() =>
                                                            handleBuyNow(product.id, cart[product.id] || 1)}>
                                                    <p>
                                                        <i className="fa fa-shopping-cart" aria-hidden="true"
                                                           style={{marginRight: "6px"}}></i>
                                                        Mua ngay
                                                    </p>
                                                </button>
                                                <button className="butn mr-2 w-30 rounded font-semibold shadow"
                                                        onClick={() =>
                                                            handleAddToCart(product.id, cart[product.id] || 1)}>
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
                                {/* Thông tin chi tiết sản phẩm */}
                                <div className="product-details">
                                    <p className="font-semibold mt-3 mb-2 text-dGreen fs-20">Thông tin chi tiết sản
                                        phẩm:</p>
                                    <ul>
                                        <li><span className="text-dGreen fs-16"><strong>Tên sản phẩm:</strong></span>
                                            <span className="text-dGreen"> {product.name}</span></li>
                                        <li><span className="text-dGreen fs-16"><strong>Giá sản phẩm:</strong></span>
                                            <span className="text-dGreen"> {product.unit_price.toLocaleString("vi-VN", {
                                                style: "currency",
                                                currency: "VND",
                                            })}</span></li>
                                        <li><span className="text-dGreen fs-16"><strong>Thương hiệu:</strong></span>
                                            <span className="text-dGreen"> {categoryName}</span></li>
                                        <li><span className="text-dGreen fs-16"><strong>Danh mục:</strong></span> <span
                                            className="text-dGreen"> {brandName}</span></li>
                                        <li><span className="text-dGreen -fs16"><strong>Mô tả sản phẩm:</strong>
                                            </span>{" "}
                                            <span
                                                className="text-dGreen product-content d-block"> {product.content}</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Form đánh giá */}
                            <div className="reviews font-semibold mt-3 mb-2 text-dGreen">
                                <h2 className="text-dGreen form-label">Đánh giá</h2>

                                {/* Form đánh giá */}
                                <div className="review-form text-dGreen">
                                    <h3 className="text-dGreen form-label">
                                        {editingReview ? "Chỉnh sửa đánh giá" : "Để lại đánh giá của bạn"}
                                    </h3>

                                    <form onSubmit={handleSubmitReview}>
                                        <div className="form-group">
                                            <label htmlFor="rating" className="form-label text-dGreen">Đánh giá
                                                (Sao):</label>
                                            <div className="rating-input">
                                                {/* Rating input */}
                                                {Array.from({length: 5}, (_, index) => (
                                                    <span
                                                        key={index}
                                                        className={index < rating ? "filled-star" : "empty-star"}
                                                        onClick={() => setRating(index + 1)}
                                                    >
                            &#9733;
                        </span>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="comment" className="form-label text-dGreen">Nhận
                                                xét:</label>
                                            <textarea
                                                id="comment"
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="form-textarea"
                                                placeholder="Viết nhận xét của bạn tại đây"
                                                required
                                            ></textarea>
                                        </div>

                                        {/* Nút gửi hoặc cập nhật đánh giá */}
                                        <div className="button-group">
                                            <button type="submit" className="btn-submit" disabled={isSubmitting}>
                                                {isSubmitting ? "Đang gửi..." : editingReviewId ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                                            </button>

                                            {editingReview && (
                                                <button
                                                    type="button"
                                                    className="btn-cancel"
                                                    onClick={handleCancelEdit} // Hủy chế độ chỉnh sửa
                                                >
                                                    Hủy
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* Hiển thị các đánh giá hiện tại */}
                                {reviews.length ? (
                                    <ul className="review-list">
                                        {reviews.map((review) => (
                                            <li key={review.id} className="review-item mt-3 mb-2">
                                                <div className="d-flex justify-content-between review-header">
                                                    <div>
                                                        <strong
                                                            className="review-username text-dGreen">{review.user_name}</strong>
                                                        <div className="review-rating">
                                                            {/* Hiển thị rating dưới dạng sao */}
                                                            {Array.from({length: 5}, (_, index) => (
                                                                <span
                                                                    key={index}
                                                                    className={index < review.rating ? "filled-star" : "empty-star"}
                                                                >
                                        &#9733;
                                    </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <button
                                                        className="btn-edit"
                                                        onClick={() => handleEditReview(review.id)} // Gọi hàm chỉnh sửa và truyền ID
                                                    >
                                                        <i className="fas fa-pencil-alt"></i>
                                                    </button>
                                                </div>
                                                <div className="review-comment">{review.comment}</div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>Chưa có đánh giá nào.</p>
                                )}
                            </div>


                        </div>
                        {/* Cột Sản Phẩm Hot */}
                        <div className="col-md-3">
                            <div className="hot-products-section p-3 border rounded shadow bg-white">
                                <p className="fs-20 font-bold text-dGreen mb-2 text-center">
                                    Sản phẩm hot
                                </p>
                                {hotProducts?.length > 0 ? (
                                    hotProducts.map((hotProduct) => (
                                        <div
                                            key={hotProduct.id}
                                            className="d-flex align-items-center mb-3 hot-product-item p-1 rounded product-hot shadow"
                                            onClick={() => navigate(`/products/${hotProduct.id}`)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = "scale(1.02)";
                                                e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = "scale(1)";
                                                e.currentTarget.style.boxShadow = "none";
                                            }}
                                        >
                                            <img src={hotProduct.image} alt={hotProduct.name}
                                                 className="rounded mr-1 img-pro-hot"/>
                                            <div>
                                                <p className="fs-14 font-bold m-0 text-dGreen overflow-hidden whitespace-nowrap name-pro-hot"
                                                   title={hotProduct.name}>
                                                    {hotProduct.name}
                                                </p>
                                                <p className="fs-14 text-dGreen font-semibold">
                                                    {hotProduct.sale_price && hotProduct.sale_price < hotProduct.unit_price ? (
                                                        // Khi có giá sale
                                                        <div
                                                            className="d-flex align-items-center justify-content-start">
                                                            {/* Giá gốc bị gạch ngang */}
                                                            <p className="fs-12 text-dGreen font-semibold text-decoration-line-through mr-2">
                                                                {hotProduct.unit_price.toLocaleString("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                })}
                                                            </p>

                                                            {/* Giá sale */}
                                                            <p className="fs-14 salePr font-semibold">
                                                                {hotProduct.sale_price.toLocaleString("vi-VN", {
                                                                    style: "currency",
                                                                    currency: "VND",
                                                                })}
                                                            </p>
                                                        </div>
                                                    ) : (
                                                        // Khi không có giá sale
                                                        <p className="fs-14 text-dGreen font-semibold">
                                                            {hotProduct.unit_price.toLocaleString("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            })}
                                                        </p>
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="fs-14 text-dGreen text-center">
                                        Không có sản phẩm hot.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sản phẩm liên quan */}
                    <div className="related-products mt-5 position-relative border rounded p-3">
                        <p className="fs-20 font-bold text-dGreen mb-2">
                            Sản phẩm liên quan
                        </p>

                        {/* Nút điều hướng Trái */}
                        {relatedProducts.length > 1 && (
                            <button onClick={() => sliderRef.current.slickPrev()} className="btn-slide-pro-left">
                                <FontAwesomeIcon icon={faChevronLeft}/>
                            </button>
                        )}

                        {/* Slider */}
                        <Slider ref={sliderRef} {...sliderSettings}>
                            {relatedProducts.length > 0 ? (
                                relatedProducts.map((relatedProduct) => (
                                    <div key={relatedProduct.id} style={{padding: '10px'}}>
                                        <div
                                            className="p-3 border rounded bg-white shadow text-center d-flex flex-column justify-between pro-lq"
                                            onClick={() => navigate(`/products/${relatedProduct.id}`)}
                                        >
                                            <img
                                                src={relatedProduct.image}
                                                alt={relatedProduct.name}
                                                className="object-fit-cover mb-1 rounded img-pro-lq"
                                            />
                                            <p className="fs-14 text-dGreen font-semibold">{relatedProduct.name}</p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                {relatedProduct.sale_price && relatedProduct.sale_price < relatedProduct.unit_price ? (
                                                    <>
                                                        {/* Giá gốc bị gạch ngang */}
                                                        <p className="fs-12 text-dGreen font-semibold m-0 text-decoration-line-through mr-1 flex-1">
                                                            {relatedProduct.unit_price.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}
                                                        </p>
                                                        {/* Giá sale */}
                                                        <p className="fs-14 salePr font-semibold m-0 flex-1">
                                                            {relatedProduct.sale_price.toLocaleString('vi-VN', {
                                                                style: 'currency',
                                                                currency: 'VND',
                                                            })}
                                                        </p>
                                                    </>
                                                ) : (
                                                    // Khi không có giá sale
                                                    <p className="fs-14 text-dGreen font-semibold m-0 text-center flex-1">
                                                        {relatedProduct.unit_price.toLocaleString('vi-VN', {
                                                            style: 'currency',
                                                            currency: 'VND',
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="fs-14 text-dGreen text-center">Không có sản phẩm liên quan.</p>
                            )}
                        </Slider>

                        {/* Nút điều hướng Phải */}
                        {relatedProducts.length > 1 && (
                            <button onClick={() => sliderRef.current.slickNext()} className="btn-slide-pro-right">
                                <FontAwesomeIcon icon={faChevronRight}/>
                            </button>
                        )}
                    </div>


                </div>
            ) : (
                <p className="text-dGreen fs-20 text-center">Sản phẩm không tồn tại.</p>
            )}
        </div>
    );

};

export default ProductDetail;