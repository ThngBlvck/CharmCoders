import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOneProduct } from "../../../../services/Product";
import { getOneBrand } from "../../../../services/Brand"; // Nhập hàm lấy 1 nhãn hàng
import { getOneCategory } from "../../../../services/Category"; // Nhập hàm lấy 1 danh mục
import {PulseLoader} from "react-spinners"; // Hàm lấy danh sách danh mục

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [brandName, setBrandName] = useState(""); // Thêm state để lưu tên nhãn hàng
    const [categoryName, setCategoryName] = useState(""); // Thêm state để lưu tên danh mục
    const [showFullDescription, setShowFullDescription] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true); // Thêm state loading

    useEffect(() => {
        fetchOneProduct();
    }, [id]);

    const fetchOneProduct = async () => {
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    };


    return (
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-white px-6 py-6">
            {product ? (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h3 className="font-bold text-2xl text-blueGray-700"
                        style={{ fontFamily: "Roboto, sans-serif" }}>Chi Tiết Sản Phẩm: {product.name}</h3>
                    <div className="flex">
                        {/* Hình ảnh nằm trong card riêng */}
                        <div className="w-1/2 pr-4">
                            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                                <img
                                    src={product.image}
                                    className="w-full h-auto object-contain rounded"
                                    alt={product.name}
                                />
                            </div>
                        </div>

                        {/* Nội dung sản phẩm nằm bên phải */}
                        <div className="w-1/2 pl-4">
                            <p className="text-lg font-semibold mb-2"><strong>Giá
                                gốc:</strong> {product.unit_price.toLocaleString()} VND</p>
                            <td className="text-lg font-semibold mb-2"><strong>Giá
                                sale:</strong> {product.sale_price !== null ? product.sale_price.toLocaleString() + " VND" : " Không có"}
                            </td>
                            <p className="text-lg font-semibold mb-2"><strong>Số lượng:</strong> {product.quantity}</p>
                            <p className="text-lg font-semibold mb-2"><strong>Lượt xem:</strong> {product.views}</p>
                            <p className="text-lg font-semibold mb-2"><strong>Lượt mua:</strong> {product.purchase_count}</p>
                            <p className="text-lg font-semibold mb-2"><strong>Trạng thái:</strong> {product.status === 1 ? "Còn Hàng" : "Hết Hàng"}</p>
                            <p className="text-lg font-semibold mb-2"><strong>Nhãn hàng:</strong> {brandName}
                            </p> {/* Hiển thị tên nhãn hàng */}
                            <p className="text-lg font-semibold mb-2"><strong>Danh mục:</strong> {categoryName}
                            </p> {/* Hiển thị tên danh mục */}
                            <p className="text-lg font-semibold mb-2">
                                <strong>Mô tả:</strong>
                                <span className={`inline ${showFullDescription ? "" : "max-h-12 overflow-hidden"}`}>
                                    {showFullDescription ? product.content : ` ${product.content.substring(0, 100)} `}
                                </span>
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-indigo-500 text-white active:bg-indigo-600 text-xs font-bold uppercase px-3 py-1 rounded outline-none focus:outline-none mr-1 mb-2 mt-3 ease-linear transition-all duration-150"
                    >
                        Quay lại
                    </button>
                </div>
            ) : (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            )}
        </div>
    );
}
