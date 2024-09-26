import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import PropTypes from "prop-types";
import { getOneProduct, updateProduct } from "../../../../services/Product"; // Hàm lấy và cập nhật sản phẩm
import { getBrand } from "../../../../services/Brand"; // Hàm lấy danh sách nhãn hàng
import { getCategory } from "../../../../services/Category"; // Hàm lấy danh sách danh mục

export default function EditProduct({ color = "light" }) {
    const { id } = useParams(); // Lấy id từ URL
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const [brands, setBrands] = useState([]); // State lưu trữ danh sách nhãn hàng
    const [categories, setCategories] = useState([]); // State lưu trữ danh sách danh mục


    useEffect(() => {
        // Lấy dữ liệu sản phẩm và danh sách nhãn hàng, danh mục khi component được render
        const fetchProductData = async () => {
            try {
                const [product, brandList, categoryList] = await Promise.all([
                    getOneProduct(id), // Gọi API lấy sản phẩm theo id
                    getBrand(), // Gọi API lấy nhãn hàng
                    getCategory() // Gọi API lấy danh mục
                ]);

                setBrands(brandList); // Lưu danh sách nhãn hàng vào state
                setCategories(categoryList); // Lưu danh sách danh mục vào state

                // Reset form với dữ liệu sản phẩm, bao gồm cả brand_id và category_id
                reset({
                    ...product,
                    brand_id: product.brand_id || '', // Đặt giá trị mặc định cho nhãn hàng
                    category_id: product.category_id || '', // Đặt giá trị mặc định cho danh mục
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: "Không thể tải dữ liệu.",
                    confirmButtonText: 'OK'
                });
            }
        };

        fetchProductData(); // Gọi hàm để lấy dữ liệu khi component được mount
    }, [id, reset]);


    const onSubmit = async (data) => {
        try {
            console.log("Dữ liệu gửi đi:", data);

            // Tạo FormData
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('brand_id', data.brand_id);
            formData.append('category_id', data.category_id);
            formData.append('status', data.status);
            formData.append('unit_price', data.unit_price);
            formData.append('sale_price', data.sale_price);
            formData.append('quantity', data.quantity);
            formData.append('content', data.content);
            if (data.image[0]) {
                formData.append('image', data.image[0]);
            }

            // Kiểm tra các trường bắt buộc
            if (!data.name || !data.quantity || !data.status || !data.unit_price) {
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: 'Vui lòng điền tất cả các trường bắt buộc!',
                    confirmButtonText: 'OK'
                });
                return; // Dừng hàm nếu có trường thiếu
            }

            const response = await updateProduct(id, formData);
            console.log("Phản hồi từ API:", response);
            Swal.fire({
                icon: 'success',
                title: 'Cập nhật sản phẩm thành công!',
                confirmButtonText: 'OK'
            });
            navigate('/admin/product');
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: error.message || "Lỗi không xác định",
                confirmButtonText: 'OK'
            });
        }
    };


    return (
        <div
            className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
        >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className={`font-semibold text-lg ${color === "light" ? "text-blueGray-700" : "text-white"}`}>
                            CẬP NHẬN SẢN PHẨM
                        </h3>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Tên sản phẩm */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tên sản phẩm</label>
                        <input
                            type="text"
                            {...register("name", {required: "Tên sản phẩm là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập tên sản phẩm"
                        />
                        {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
                    </div>

                    {/* Nhãn hàng */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nhãn hàng</label>
                        <select
                            {...register("brand_id", {required: "Vui lòng chọn nhãn hàng"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn nhãn hàng</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>{brand.name}</option>
                            ))}
                        </select>
                        {errors.brand_id && <p className="text-red-500 text-xs italic">{errors.brand_id.message}</p>}
                    </div>

                    {/* Danh mục */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Danh mục</label>
                        <select
                            {...register("category_id", {required: "Vui lòng chọn danh mục"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id &&
                            <p className="text-red-500 text-xs italic">{errors.category_id.message}</p>}
                    </div>

                    {/* Trạng thái */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                        <select
                            {...register("status", {required: "Vui lòng chọn trạng thái"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">Chọn trạng thái</option>
                            <option value="1">Hiện</option>
                            <option value="0">Ẩn</option>
                        </select>
                        {errors.status && <p className="text-red-500 text-xs italic">{errors.status.message}</p>}
                    </div>

                    {/* Giá sản phẩm */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Giá gốc</label>
                        <input
                            type="number"
                            {...register("unit_price", {required: "Giá gốc là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập giá gốc"
                        />
                        {errors.unit_price &&
                            <p className="text-red-500 text-xs italic">{errors.unit_price.message}</p>}
                    </div>

                    {/* Giá sale */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Giá sale</label>
                        <input
                            type="number"
                            {...register("sale_price")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập giá sale (nếu có)"
                        />
                    </div>

                    {/* Số lượng */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Số lượng</label>
                        <input
                            type="number"
                            {...register("quantity", {required: "Số lượng là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập số lượng"
                        />
                        {errors.quantity && <p className="text-red-500 text-xs italic">{errors.quantity.message}</p>}
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh</label>
                        <input
                            type="file"
                            {...register("image")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                    </div>

                    {/* Nội dung */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nội dung</label>
                        <textarea
                            {...register("content")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập nội dung mô tả sản phẩm"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

EditProduct.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
