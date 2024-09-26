import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneProduct } from "../../../../services/Product";
import { getOneBrand } from "../../../../services/Brand"; // Nhập hàm lấy 1 nhãn hàng
import { getOneCategory } from "../../../../services/Category"; // Nhập hàm lấy 1 danh mục

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brandName, setBrandName] = useState(""); // Thêm state để lưu tên nhãn hàng
    const [categoryName, setCategoryName] = useState(""); // Thêm state để lưu tên danh mục
    const [showFullDescription, setShowFullDescription] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOneProduct();
    }, [id]);

    const fetchOneProduct = async () => {
        try {
            const result = await getOneProduct(id);
            setProduct(result);

            // Lấy tên nhãn hàng từ API dựa trên brand_id
            if (result.brand_id) {
                const brandResult = await getOneBrand(result.brand_id);
                setBrandName(brandResult.name); // Lưu tên nhãn hàng vào state
            }

            // Lấy tên danh mục từ API dựa trên category_id
            if (result.category_id) {
                const categoryResult = await getOneCategory(result.category_id);
                setCategoryName(categoryResult.name); // Lưu tên danh mục vào state
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        }
    };

    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white px-6 py-6">
            {product ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="text-2xl font-semibold mb-4">Chi Tiết Sản Phẩm: {product.name}</h3>
                    <div className="flex">
                        {/* Hình ảnh nằm trong card riêng */}
                        <div className="w-2/3 ml-8">
                            <div className="bg-white shadow-md rounded-lg p-5 m-5">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-64 w-64 object-cover rounded"
                                />
                            </div>
                        </div>

                        {/* Nội dung sản phẩm nằm bên phải */}
                        <div className="w-1/3 pl-12">
                            <p className="text-lg font-semibold mb-2">Giá gốc: {product.unit_price.toLocaleString()} VND</p>
                            <p className="text-lg font-semibold mb-2">Giá sale: {product.sale_price.toLocaleString()} VND</p>
                            <p className="text-lg font-semibold mb-2">Số lượng: {product.quantity}</p>
                            <p className="text-lg font-semibold mb-2">Lượt xem: {product.views}</p>
                            <p className="text-lg font-semibold mb-2">Trạng thái: {product.status === 1 ? "Hiện" : "Ẩn"}</p>
                            <p className="text-lg font-semibold mb-2">Nhãn hàng: {brandName}</p> {/* Hiển thị tên nhãn hàng */}
                            <p className="text-lg font-semibold mb-2">Danh mục: {categoryName}</p> {/* Hiển thị tên danh mục */}
                            <p className="text-lg font-semibold mb-2">
                                Mô tả:
                                <span className={`inline ${showFullDescription ? "" : "max-h-12 overflow-hidden"}`}>
                                    {showFullDescription ? product.content : ` ${product.content.substring(0, 100)} ...`}
                                </span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    >
                        Quay lại
                    </button>
                </div>
            ) : (
                <p className="text-center">Đang tải...</p>
            )}
        </div>
    );
}
