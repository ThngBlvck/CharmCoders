import React, {useEffect, useState, useRef} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {getOneProduct, getRelatedProducts, getHotProducts} from "../../../services/Product";
import {getOneBrand} from "../../../services/Brand";
import {getOneCategory} from "../../../services/Category";
import {addToCart} from "../../../services/Cart";
import {getCommentsByProductId, addComment, deleteComment} from "../../../services/Comment";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.css';
import "../../../assets/styles/css/productdt/index.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner, faTrash} from "@fortawesome/free-solid-svg-icons";
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
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [loadingProduct, setLoadingProduct] = useState(true);
    const [newComment, setNewComment] = useState("");
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const sliderRef = useRef(null);
    const [hotProducts, setHotProducts] = useState([]); // Thêm state để lưu danh sách sản phẩm hot

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
        draggable: false,
        swipe: false,
        responsive: [
            {breakpoint: 1024, settings: {slidesToShow: 3}},
            {breakpoint: 768, settings: {slidesToShow: 2}},
            {breakpoint: 480, settings: {slidesToShow: 1}},
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

            // Lấy bình luận
            const commentsResult = await getCommentsByProductId(id);
            setComments(commentsResult);

            // Lấy sản phẩm liên quan
            const relatedProductsResult = await getRelatedProducts(id);
            setRelatedProducts(relatedProductsResult.related_products);

            // Lấy sản phẩm hot
            const hotProductsResult = await getHotProducts();
            if (hotProductsResult && hotProductsResult.hot_products) {
                setHotProducts(hotProductsResult.hot_products);
            } else {
                toast.warning('Không có sản phẩm hot nào được tìm thấy.');
            }
        } catch (error) {
            toast.error('Có lỗi xảy ra khi tải sản phẩm.');
            console.error('Error fetching product details:', error);
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


    const handleNewCommentChange = (e) => {
        const value = e.target.value;

        if (value.length > 500) {
            toast.warn("Nội dung bình luận không được vượt quá 500 ký tự.");
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
            toast.warn("Vui lòng nhập nội dung bình luận.");
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
            toast.success("Bình luận đã được thêm thành công.");

            const commentsResult = await getCommentsByProductId(id);
            setComments(commentsResult);
        } catch (error) {
            console.error("Error adding comment:", error);
            toast.error("Lỗi. Không thể thêm bình luận.");
        }
    };
    const handleDeleteComment = async (commentId) => {
        if (!token) {
            toast.warn("Bạn cần đăng nhập để xóa bình luận.");
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
                toast.success("Bình luận đã được xóa thành công.");

                // Lấy lại danh sách bình luận sau khi xóa
                const commentsResult = await getCommentsByProductId(id);
                setComments(commentsResult);
            } catch (error) {
                console.error("Error deleting comment:", error);
                toast.error("Lỗi. Không thể xóa bình luận này.");
            }
        }
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

                            {/* Phần bình luận */}
                            <div className="comments-section mt-5">
                                <Skeleton height={20} width="100%"/>
                                <div className="p-4 border rounded bg-white shadow">
                                    <form onSubmit={handleSubmitComment} className="p-3 mb-4 border rounded">
                                        <div className="form-group">
                                            <label htmlFor="newComment" className="font-bold fs-14 text-dGreen">
                                                <Skeleton height={20} width="100%"/>
                                            </label>
                                            <textarea
                                                className="form-control comment-resize"
                                                id="newComment"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                rows="3"
                                            />
                                        </div>
                                        <Skeleton height={40} width="40%"/>
                                    </form>
                                    {/* Hiển thị danh sách bình luận */}

                                    <div className="mt-4">
                                        {comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="mb-3 p-3 rounded border">
                                                    <div
                                                        className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <Skeleton height={20} width="100%"/>
                                                        </div>
                                                        <Skeleton height={40} width="40%"/>
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

                            {/* Phần bình luận */}
                            <div className="comments-section mt-5">
                                <p className="text-dGreen font-semibold fs-20 mb-2">Bình luận</p>
                                <div className="p-4 border rounded bg-white shadow">
                                    <form onSubmit={handleSubmitComment} className="p-3 mb-4 border rounded">
                                        <div className="form-group">
                                            <label htmlFor="newComment" className="font-bold fs-14 text-dGreen">
                                                Viết bình luận:
                                            </label>
                                            <textarea
                                                className="form-control comment-resize"
                                                id="newComment"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                rows="3"
                                            />
                                        </div>
                                        <button type="submit" className="butn rounded w-16 mt-2 shadow border-none">
                                            Gửi
                                        </button>
                                    </form>
                                    {/* Hiển thị danh sách bình luận */}

                                    <div className="mt-4">
                                        {comments.length > 0 ? (
                                            comments.map((comment) => (
                                                <div key={comment.id} className="mb-3 p-3 rounded border">
                                                    <div
                                                        className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <p className="fs-14 text-dGreen mb-1 font-bold">
                                                                {comment.user_name}
                                                            </p>
                                                            <p className="fs-14 text-dGreen">
                                                                {comment.content}
                                                            </p>
                                                        </div>
                                                        <button onClick={() => handleDeleteComment(comment.id)}
                                                                className="border-none bg-none del-comment fs-14"
                                                                title="Xóa bình luận">
                                                            <FontAwesomeIcon icon={faTrash}/> Xóa
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-dGreen fs-14">
                                                Không có bình luận nào.
                                            </p>
                                        )}
                                    </div>

                                </div>
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
                    <div className="related-products mt-5 position-relative">
                        <p className="fs-20 font-bold text-dGreen mb-2">
                            Sản phẩm liên quan
                        </p>

                        {/* Nút điều hướng Trái */}
                        <button onClick={() => sliderRef.current.slickPrev()} className="btn-slide-pro-left">
                            <FontAwesomeIcon icon={faChevronLeft}/>
                        </button>

                        {/* Slider */}
                        <Slider ref={sliderRef} {...sliderSettings}>
                            {relatedProducts.length > 0 ? (
                                relatedProducts.map((relatedProduct) => (
                                    <div key={relatedProduct.id} style={{padding: '10px'}}>
                                        <div
                                            className="p-3 border rounded bg-white shadow text-center d-flex flex-column justify-between pro-lq"
                                            onClick={() =>
                                                navigate(`/products/${relatedProduct.id}`)
                                            }>
                                            <img src={relatedProduct.image} alt={relatedProduct.name}
                                                 className="object-fit-cover mb-1 rounded img-pro-lq"/>
                                            <p className="fs-14 text-dGreen font-semibold">
                                                {relatedProduct.name}
                                            </p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                {relatedProduct.sale_price && relatedProduct.sale_price < relatedProduct.unit_price ? (
                                                    // Khi có giá sale
                                                    <>
                                                        {/* Giá gốc bị gạch ngang */}
                                                        <p className="fs-12 text-dGreen font-semibold m-0 text-decoration-line-through mr-1 flex-1">
                                                            {relatedProduct.unit_price.toLocaleString("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            })}
                                                        </p>
                                                        {/* Giá sale */}
                                                        <p className="fs-14 salePr font-semibold m-0 flex-1">
                                                            {relatedProduct.sale_price.toLocaleString("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND",
                                                            })}
                                                        </p>
                                                    </>
                                                ) : (
                                                    // Khi không có giá sale
                                                    <p className="fs-14 text-dGreen font-semibold m-0 text-center flex-1">
                                                        {relatedProduct.unit_price.toLocaleString("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND",
                                                        })}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="fs-14 text-dGreen text-center">
                                    Không có sản phẩm liên quan.
                                </p>
                            )}
                        </Slider>

                        {/* Nút điều hướng Phải */}
                        <button onClick={() => sliderRef.current.slickNext()} className="btn-slide-pro-right">
                            <FontAwesomeIcon icon={faChevronRight}/>
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-dGreen fs-20 text-center">Sản phẩm không tồn tại.</p>
            )}
        </div>
    );

};

export default ProductDetail;