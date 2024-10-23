import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlogCategory } from "../../../services/BlogCategory"; // Assuming these services exist
import { getBlog } from "../../../services/Blog"; // Assuming these services exist
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import "../../../assets/styles/css/bootstrap.min.css";

export default function Post() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all"); // "all" for all categories
    const [categories, setCategories] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state

    const postsPerPage = 6;
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        fetchCategories();
        fetchPosts();
    }, [selectedCategory]); // Refetch posts when category changes

    // Fetch categories
    const fetchCategories = async () => {
        setLoading(true); // Set loading true when fetching starts
        try {
            const result = await getBlogCategory();
            setCategories(result || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
            Swal.fire("Error", "Could not load categories. Please try again later.", "error");
        } finally {
            setLoading(false); // Set loading false when fetching ends
        }
    };

    // Fetch posts based on selected category
    const fetchPosts = async () => {
        setLoading(true); // Set loading true when fetching starts
        try {
            const result = await getBlog(selectedCategory);
            setPosts(result || []);
        } catch (error) {
            console.error("Error fetching posts:", error);
            Swal.fire("Error", "Could not load posts. Please try again later.", "error");
        } finally {
            setLoading(false); // Set loading false when fetching ends
        }
    };

    // Paginate posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Handle category selection
    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset to page 1 when category changes
    };

    return (
        <div className="container py-2">
            {/* Breadcrumb */}
            <div className="container-fluid py-3" style={{ backgroundColor: "#fff7f8" }}>
                <div className="container text-center py-5">
                    <p className="mb-4 font-semibold" style={{ color: "#ffa69e", fontSize: "40px" }}>Bài viết</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{ color: "#ffa69e" }}>
                            <NavLink to={`/home`}>Trang chủ</NavLink>
                        </li>
                        <li className="breadcrumb-item active font-bold" style={{ color: "#ffa69e" }}>Bài viết</li>
                    </ol>
                </div>
            </div>

            {/* Content */}
            <div className="d-flex row justify-content-between mt-4">
                {/* Left column - Post categories */}
                <div className="col-md-3">
                    <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold mb-3">Danh mục bài viết</p>
                    <ul className="list-group">
                        <li className="list-group-item font-semibold d-flex align-items-center"
                            style={{ border: "none", cursor: "pointer" }} onClick={() => handleCategoryClick("all")}>
                            <i className="fa fa-list-alt" aria-hidden="true" style={{ marginRight: "6px", color: "#8c5e58" }}></i>
                            <p style={{ color: "#8c5e58", margin: 0 }}>Tất cả bài viết</p>
                        </li>
                        {categories.map((category) => (
                            <li className="list-group-item font-semibold d-flex align-items-center" key={category.id}
                                style={{ border: "none", cursor: "pointer" }}
                                onClick={() => handleCategoryClick(category.id)}>
                                <i className="fa fa-list-alt" aria-hidden="true" style={{ marginRight: "6px", color: "#8c5e58" }}></i>
                                <p style={{ color: "#8c5e58", margin: 0 }}>{category.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Right column - Posts and pagination */}
                <div className="col-md-9 row">
                    <p style={{ fontSize: "20px", color: "#8c5e58" }} className="font-bold mb-3 text-center">Danh sách bài viết</p>
                    {loading ? (
                        <div className="text-center">
                            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                            <p>Đang tải...</p>
                        </div>
                    ) : (
                        currentPosts.length > 0 ? (
                            currentPosts.map((post) => (
                                <div className="col-12 col-md-6 mb-4" key={post.id}>
                                    <div className="card bg-hover" style={{ borderRadius: '15px', padding: '20px' }}>
                                        <NavLink to={`/postdetail/${post.id}`}>
                                            <img src={post.image} className="card-img-top" alt={post.title} style={{ maxHeight: '400px', objectFit: 'cover' }} />
                                        </NavLink>
                                        <div className="card-body">
                                            <NavLink to={`/postdetail/${post.id}`}>
                                                <p className="card-title font-semibold text-center" style={{ color: "#8c5e58", fontSize: "1.2rem" }}>
                                                    {post.title}
                                                </p>
                                            </NavLink>
                                            <p className="card-text align-content-start" style={{ color: "#8c5e58", marginBottom: '1rem' }}>{post.summary}</p>
                                            <button className="btn btn-primary w-100 font-bold" style={{ color: "#442e2b" }} onClick={() => navigate(`/postdetail/${post.id}`)}>
                                                Xem chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có bài viết nào.</p>
                        )
                    )}

                    {/* Pagination */}
                    {!loading && (
                        <div className="d-flex justify-content-center mt-4">
                            <nav>
                                <ul className="pagination pagination-custom">
                                    {Array.from({ length: totalPages }, (_, index) => (
                                        <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                            <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                                {index + 1}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
