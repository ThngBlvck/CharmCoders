import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { postBlog, updateBlog, getOneBlog } from "../../../../services/Blog"; // Updated service imports
import { getBlogCategory } from "../../../../services/BlogCategory";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import Swal from "sweetalert2"; // Import SweetAlert2
import "sweetalert2/src/sweetalert2.scss"; // Optional: import SweetAlert2 styles

export default function EditBlog({ color = "light" }) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setValue,
    } = useForm();

    const [content, setContent] = useState("");
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null); // State for handling the image
    const navigate = useNavigate();
    const { id } = useParams(); // Get the blog post ID from URL parameters

    // Fetch categories and blog post data when the component loads
    useEffect(() => {
        async function fetchCategoriesAndPost() {
            try {
                const categoryResponse = await getBlogCategory();
                if (Array.isArray(categoryResponse)) {
                    setCategories(categoryResponse);
                } else if (categoryResponse && categoryResponse.data && Array.isArray(categoryResponse.data)) {
                    setCategories(categoryResponse.data);
                } else {
                    Swal.fire("Lỗi!", "Lỗi khi tải danh mục. Vui lòng thử lại.", "error");
                }

                if (id) { // Fetch blog post data if id exists
                    const postResponse = await getOneBlog(id);
                    if (postResponse) {
                        setValue("title", postResponse.title);
                        setContent(postResponse.content);
                        setValue("category_id", postResponse.categoryId);
                        // Remove status from the form since it's fixed to 1
                    } else {
                        Swal.fire("Lỗi!", "Lỗi khi tải bài viết. Vui lòng thử lại.", "error");
                    }
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                Swal.fire("Lỗi!", "Lỗi khi tải dữ liệu. Vui lòng thử lại.", "error");
            }
        }
        fetchCategoriesAndPost();
    }, [id, setValue]);

    const onSubmit = async (data) => {
        if (!data.title.trim()) {
            Swal.fire("Lỗi!", "Tiêu đề bài viết không được bỏ trống.", "error");
            return;
        }

        if (!content.trim()) {
            Swal.fire("Lỗi!", "Nội dung bài viết không được bỏ trống.", "error");
            return;
        }

        if (!data.categoryId) {
            Swal.fire("Lỗi!", "Vui lòng chọn danh mục.", "error");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("content", content);
            formData.append("category_id", data.categoryId);
            formData.append("status", 1); // Hardcoded status as 1 (Hiển thị)

            if (image) {
                formData.append("image", image); // Append the new image if selected
            }

            if (id) {
                // Update existing blog post
                await updateBlog(id, formData);
                Swal.fire("Thành công!", "Cập nhật bài viết thành công.", "success");
            } else {
                // Create new blog post
                await postBlog(formData);
                Swal.fire("Thành công!", "Thêm bài viết thành công.", "success");
            }

            reset();
            navigate("/admin/blog");
        } catch (err) {
            console.error("Error saving blog post:", err);
            Swal.fire("Lỗi!", "Lỗi khi lưu bài viết. Vui lòng thử lại.", "error");
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]); // Set the selected image
        }
    };

    return (
        <>
            <div
                className={`relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded ${
                    color === "light" ? "bg-white" : "bg-lightBlue-900 text-white"
                }`}
            >
                <div className="rounded-t mb-0 px-4 py-3 border-0">
                    <div className="flex flex-wrap items-center">
                        <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                            <h3 className={
                                "font-bold text-2xl text-lg " +
                                (color === "light" ? "text-blueGray-700" : "text-white")
                            } style={{ fontFamily: 'Roboto, sans-serif' }}>
                                CẬP NHẬT BÀI VIẾT
                            </h3>
                        </div>
                    </div>
                </div>
                <div className="p-4">
                    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Nội dung bài viết</label>
                            <CKEditor
                                editor={ClassicEditor}
                                data={content}
                                onChange={(event, editor) => {
                                    const data = editor.getData();
                                    setContent(data);
                                }}
                            />
                        </div>

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

                        {/* Image upload */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Hình ảnh</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <button
                                type="submit"
                                className={`bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Đang lưu..." : id ? "Cập nhật bài viết" : "Thêm bài viết"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

EditBlog.propTypes = {
    color: PropTypes.oneOf(["light", "dark"]),
};
