import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { postImage, getProductList } from "../../../../services/Album"; // Thêm hàm lấy danh sách sản phẩm
import { getProduct } from "../../../../services/Product"; // Thêm hàm lấy danh sách sản phẩm
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { ToastContainer } from 'react-toastify';
import Swal from 'sweetalert2';
import 'react-toastify/dist/ReactToastify.css';
import { PulseLoader } from 'react-spinners';

export default function AddAlbum({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [selectedImages, setSelectedImages] = useState([]); // Lưu danh sách các hình ảnh đã chọn
    const [albumImages, setAlbumImages] = useState([]); // Lưu danh sách hình ảnh trong album
    const [productId, setProductId] = useState(""); // Lưu id sản phẩm
    const [productList, setProductList] = useState([]); // Danh sách sản phẩm

    // Lấy danh sách sản phẩm từ service
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProduct(); // Giả sử có hàm getProductList() để lấy danh sách sản phẩm
                setProductList(products);
            } catch (err) {
                console.error('Error fetching products:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImages(files);
    };

    const handleAlbumImageChange = (event) => {
        const files = Array.from(event.target.files);
        setAlbumImages((prevImages) => [...prevImages, ...files]); // Thêm hình ảnh mới vào danh sách đã có
    };

    const handleRemoveImage = (index) => {
        setAlbumImages((prevImages) => prevImages.filter((_, i) => i !== index)); // Xóa hình ảnh tại chỉ mục
    };

    const onSubmit = async (data) => {
        if (!data.status) {
            Swal.fire('Lỗi', 'Vui lòng chọn trạng thái.', 'error');
            return;
        }

        // Kiểm tra ít nhất một hình ảnh được chọn
        if (!(selectedImages.length || albumImages.length)) {
            Swal.fire('Lỗi', 'Vui lòng chọn ít nhất một hình ảnh.', 'error');
            return;
        }

        if (!productId) {
            Swal.fire('Lỗi', 'Vui lòng chọn ID sản phẩm.', 'error');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("status", data.status);
            formData.append("product_id", productId);

            // Lặp qua tất cả các hình ảnh đã chọn và thêm vào FormData
            selectedImages.forEach((file) => {
                formData.append("images[]", file);
            });

            // Lặp qua tất cả các hình ảnh album và thêm vào FormData
            albumImages.forEach((file) => {
                formData.append("images[]", file);
            });

            await postImage(formData);

            Swal.fire('Thành công', 'Thêm album thành công.', 'success').then(() => {
                reset();
                setSelectedImages([]);
                setAlbumImages([]);
                setProductId("");
                navigate('/admin/album');
            });

        } catch (err) {
            console.error('Error adding album:', err);
            Swal.fire('Lỗi', 'Lỗi khi thêm album. Vui lòng thử lại.', 'error');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <div className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}>
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className={ "font-bold text-2xl text-lg " + (color === "light" ? "text-blueGray-700" : "text-white") } style={{ fontFamily: 'Roboto, sans-serif' }}>
                                THÊM ALBUM
                            </h3>
                        </div>
                    </div>
                </div>
                {isSubmitting ? (
                    <div className="flex justify-center items-center py-4">
                        <PulseLoader color="#4A90E2" loading={loading} size={15} />
                    </div>
                ) : (
                    <div className="p-4">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Xem trước danh sách các hình ảnh đã chọn */}
                            {selectedImages.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh đã chọn:</label>
                                    <div className="flex flex-wrap gap-4">
                                        {selectedImages.map((image, index) => (
                                            <div key={index} className="w-20 h-20 border rounded overflow-hidden">
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`selected-${index}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Chọn album hình ảnh */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Album Hình ảnh</label>
                                <input
                                    type="file"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAlbumImageChange}
                                />
                                {albumImages.length > 0 && (
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">Album hình ảnh đã chọn:</label>
                                        <div className="flex flex-wrap gap-4">
                                            {albumImages.map((image, index) => (
                                                <div key={index} className="w-20 h-20 relative border rounded overflow-hidden">
                                                    <img
                                                        src={URL.createObjectURL(image)}
                                                        alt={`album-${index}`}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveImage(index)}
                                                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                                                    >
                                                        X
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Chọn ID sản phẩm từ danh sách */}
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">ID Sản phẩm</label>
                                <select
                                    value={productId}
                                    onChange={(e) => setProductId(e.target.value)}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Chọn sản phẩm</option>
                                    {productList.map((product) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.product_id && <p className="text-red-500 text-xs italic">{errors.product_id.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">Trạng thái</label>
                                <select
                                    {...register("status", { required: "Vui lòng chọn trạng thái" })}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value="1">Hiển thị</option>
                                    <option value="2">Ẩn</option>
                                </select>
                                {errors.status && <p className="text-red-500 text-xs italic">{errors.status.message}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <button
                                    type="submit"
                                    className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                    disabled={isSubmitting}
                                >
                                    Thêm album
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <ToastContainer />
        </>
    );
}

AddAlbum.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
