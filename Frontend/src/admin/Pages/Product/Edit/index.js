import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2';
import PropTypes from "prop-types";
import { getOneProduct, updateProduct } from "../../../../services/Product"; // Hàm lấy và cập nhật sản phẩm
import { getBrand } from "../../../../services/Brand"; // Hàm lấy danh sách nhãn hàng
import { getCategory } from "../../../../services/Category";
import {PulseLoader} from "react-spinners"; // Hàm lấy danh sách danh mục

export default function EditProduct({ color = "light" }) {
    const { id } = useParams(); // Lấy id từ URL
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
        watch,
    } = useForm();

    const navigate = useNavigate();
    const [brands, setBrands] = useState([]); // State lưu trữ danh sách nhãn hàng
    const [categories, setCategories] = useState([]); // State lưu trữ danh sách danh mục
    const [originalProduct, setOriginalProduct] = useState(null); // State lưu trữ dữ liệu sản phẩm gốc
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [selectedImage, setSelectedImage] = useState(null); // State lưu trữ hình ảnh đã chọn

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true); // Bắt đầu loading
            try {
                const [product, brandList, categoryList] = await Promise.all([
                    getOneProduct(id), // Gọi API lấy sản phẩm theo id
                    getBrand(), // Gọi API lấy nhãn hàng
                    getCategory() // Gọi API lấy danh mục
                ]);

                setBrands(brandList); // Lưu danh sách nhãn hàng vào state
                setCategories(categoryList); // Lưu danh sách danh mục vào state
                setOriginalProduct(product); // Lưu dữ liệu sản phẩm gốc

                reset({
                    ...product,
                    brand_id: product.brand_id || '', // Đặt giá trị mặc định cho nhãn hàng
                    category_id: product.category_id || '', // Đặt giá trị mặc định cho danh mục
                    status: product.quantity > 0 ? "0" : "1", // Cập nhật giá trị trạng thái ban đầu
                });

                if (product.image) {
                    setSelectedImage(product.image); // Lưu đường dẫn hình ảnh gốc
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                Swal.fire({
                    icon: 'error',
                    title: 'Có lỗi xảy ra',
                    text: "Không thể tải dữ liệu.",
                    confirmButtonText: 'OK'
                });
            } finally {
                setLoading(false); // Kết thúc trạng thái tải
            }
        };

        fetchProductData(); // Gọi hàm để lấy dữ liệu khi component được mount
    }, [id, reset]);

    const quantity = watch("quantity"); // Theo dõi số lượng

    useEffect(() => {
        // Cập nhật trạng thái dựa trên số lượng
        if (quantity > 0) {
            setValue("status", "1"); // Còn hàng
        } else {
            setValue("status", "0"); // Hết hàng
        }
    }, [quantity, setValue]);


    const onSubmit = async (data) => {
        if (!data.name || !data.quantity || !data.status || !data.unit_price) {
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: 'Vui lòng điền tất cả các trường bắt buộc!',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const formData = new FormData();

            // Thêm các trường bắt buộc
            formData.append('name', data.name || originalProduct.name);
            formData.append('brand_id', data.brand_id || originalProduct.brand_id);
            formData.append('category_id', data.category_id || originalProduct.category_id);
            formData.append('status', data.status || originalProduct.status);
            formData.append('unit_price', data.unit_price || originalProduct.unit_price);
            formData.append('sale_price', data.sale_price || originalProduct.sale_price);
            formData.append('quantity', data.quantity || originalProduct.quantity);
            formData.append('content', data.content || originalProduct.content);
            formData.append("_method", "PUT");

            // Thêm ảnh nếu người dùng chọn mới, nếu không thì giữ nguyên ảnh cũ
            if (data.image && data.image[0]) {
                formData.append('image', data.image[0]); // Hình ảnh mới được chọn
            } else if (originalProduct.image) {
                formData.append('image', originalProduct.image); // Hình ảnh cũ từ CSDL
            }

            formData.append("_method", "PUT");

            const response = await updateProduct(id, formData);
            console.log("Phản hồi từ API:", response);
            Swal.fire({
                icon: 'success',
                title: 'Cập nhật sản phẩm thành công!',
                confirmButtonText: 'OK'
            });
            navigate('/admin/product');
        } catch (error) {
            console.error("Lỗi khi cập nhật sản phẩm:", error.response?.data || error.message);
            Swal.fire({
                icon: 'error',
                title: 'Có lỗi xảy ra',
                text: error.response?.data.message || "Lỗi không xác định",
                confirmButtonText: 'OK'
            });
        }
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];

            // Kiểm tra định dạng file
            if (!validImageTypes.includes(file.type)) {
                Swal.fire({
                    icon: 'error',
                    title: 'File không hợp lệ',
                    text: 'Hình ảnh phải có định dạng: jpeg, png, jpg, gif.',
                    confirmButtonText: 'OK'
                });
                return;
            }

            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl); // Hiển thị hình ảnh đã chọn
        } else {
            setSelectedImage(originalProduct.image); // Nếu không có hình ảnh mới, đặt lại hình ảnh gốc
        }
    };


    return (
        <div
            className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
        >
            <div className="rounded-t mb-0 px-4 py-3 border-0">
                <div className="flex flex-wrap items-center">
                    <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                        <h3 className="font-bold text-2xl text-blueGray-700"
                            style={{ fontFamily: "Roboto, sans-serif" }}>
                            CẬP NHẬT SẢN PHẨM
                        </h3>
                    </div>
                </div>
            </div>
            {loading ?  (
                <div className="flex justify-center items-center py-4">
                    <PulseLoader color="#4A90E2" loading={loading} size={15}/>
                </div>
            ) : (
            <div className="p-4">
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap">
                    {/* Cột 1 */}
                    <div className="w-1/2 px-2">
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
                            {brands?.map((brand) => (
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
                            {categories?.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                            ))}
                        </select>
                        {errors.category_id && <p className="text-red-500 text-xs italic">{errors.category_id.message}</p>}
                    </div>
                    </div>

                    {/* Cột 2 */}
                    <div className="w-1/2 px-2">
                    {/* Giá gốc */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Giá gốc (VND)</label>
                        <input
                            type="number"
                            {...register("unit_price", {required: "Giá gốc là bắt buộc"})}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập giá gốc"
                        />
                        {errors.unit_price && <p className="text-red-500 text-xs italic">{errors.unit_price.message}</p>}
                    </div>

                    {/* Giá sale */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Giá sale (VND)</label>
                        <input
                            type="number"
                            {...register("sale_price")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập giá sale"
                        />
                        </div>

                        {/* Số lượng */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Số lượng</label>
                            <input
                                type="number"
                                {...register("quantity", { required: "Số lượng là bắt buộc" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập số lượng"
                            />
                            {errors.quantity && <p className="text-red-500 text-xs italic">{errors.quantity.message}</p>}
                        </div>

                        {/* Trạng thái */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                            <select
                                {...register("status")}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                disabled
                            >
                                <option value="1">Còn hàng</option>
                                <option value="0">Hết hàng</option>
                            </select>
                        </div>
                    </div>

                    {/* Nội dung */}
                    <div className="mb-4 w-full w-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Nội dung</label>
                        <textarea
                            {...register("content")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            placeholder="Nhập nội dung sản phẩm"
                        ></textarea>
                    </div>

                    {/* Hình ảnh */}
                    <div className="mb-4 w-full w-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh</label>
                        <input
                            type="file"
                            {...register("image")}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            onChange={handleImageChange}
                        />
                        {selectedImage && <img src={selectedImage} alt="Hình ảnh sản phẩm" className="mb-4 w-40 h-40 object-cover"/>}
                    </div>


                    {/* Nút Submit */}
                    <div className="flex items-center justify-between">
                        <button
                            type="submit"
                            className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            disabled={isSubmitting}
                        >
                            Cập nhật sản phẩm
                        </button>
                    </div>
                </form>
            </div>
                )}
        </div>
    );
}

EditProduct.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
