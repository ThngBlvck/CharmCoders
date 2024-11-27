import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { postBlog } from "../../../../services/Blog"; // Service to handle blog post creation
import { getBlogCategory } from "../../../../services/BlogCategory"; // Service to fetch categories
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2"; // Import SweetAlert2

export default function AddBlog({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm();

    const [content, setContent] = useState(""); // State to manage CKEditor content
    const [categories, setCategories] = useState([]); // State to manage blog categories
    const [image, setImage] = useState(null); // State to manage the uploaded image
    const navigate = useNavigate(); // Initialize useNavigate

    // Fetch categories when the component loads
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await getBlogCategory(); // Gọi API để lấy danh mục
                if (Array.isArray(response)) {
                    setCategories(response);
                } else if (response?.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    Swal.fire("Lỗi", "Lỗi khi tải danh mục. Vui lòng thử lại.", "error");
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                Swal.fire("Lỗi", "Lỗi khi tải danh mục. Vui lòng thử lại.", "error");
            }
        }
        fetchCategories();
    }, []);

    const onSubmit = async (data) => {
        if (!data.title.trim()) {
            Swal.fire("Lỗi", "Tiêu đề bài viết không được bỏ trống.", "error");
            return;
        }

        if (!content.trim()) {
            Swal.fire("Lỗi", "Nội dung bài viết không được bỏ trống.", "error");
            return;
        }

        if (!data.categoryId) {
            Swal.fire("Lỗi", "Vui lòng chọn danh mục.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("content", content);
        formData.append("category_id", data.categoryId);
        formData.append("status", data.status);

        // Append the image if one was uploaded
        if (image) {
            formData.append("image", image);
        }

        try {
            await postBlog(formData); // Pass formData instead of a regular object
            Swal.fire("Thành công", "Thêm bài viết thành công.", "success");
            reset(); // Clear the form after success
            setImage(null); // Clear image state
            navigate("/admin/blog"); // Redirect to blog management page
        } catch (err) {
            console.error("Error adding blog post:", err);
            Swal.fire("Lỗi", "Lỗi khi thêm bài viết. Vui lòng thử lại.", "error");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    return (
        <>
            <div
                className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"}`}
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className={"font-bold text-2xl text-lg " + (color === "light" ? "text-blueGray-700" : "text-white")
                            } style={{ fontFamily: 'Roboto, sans-serif' }} // Áp dụng font chữ Roboto
                            >
                                THÊM BÀI VIẾT MỚI
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Tiêu đề bài viết */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tiêu đề</label>
                            <input
                                type="text"
                                {...register("title", { required: "Tiêu đề bài viết là bắt buộc" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Nhập tiêu đề bài viết"
                            />
                            {errors.title && <p className="text-red-500 text-xs italic">{errors.title.message}</p>}
                        </div>

                        {/* Nội dung bài viết (CKEditor) */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nội dung bài viết</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setContent(data); // Update CKEditor content state
                                }}
                            />
                        </div>

                        {/* Chọn danh mục */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Danh mục</label>
                            <select
                                {...register("categoryId", { required: "Vui lòng chọn danh mục" })}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            >
                                <option value="">Chọn danh mục</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Không có danh mục</option>
                                )}
                            </select>
                            {errors.categoryId && <p className="text-red-500 text-xs italic">{errors.categoryId.message}</p>}
                        </div>

                        {/* Trạng thái */}
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

                        {/* Upload hình ảnh */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                        </div>

                        {/* Nút thêm */}
                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang thêm..." : "Thêm bài viết"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

AddBlog.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
