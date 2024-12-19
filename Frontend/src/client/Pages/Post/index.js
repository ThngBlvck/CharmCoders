import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getBlogCategory } from "../../../services/BlogCategory"; // Assuming these services exist
import { getBlog } from "../../../services/Blog"; // Assuming these services exist
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import "../../../assets/styles/css/bootstrap.min.css";
import {toast} from "react-toastify";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Post() {
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState("all"); // "all" for all categories
    const [categories, setCategories] = useState([]);
    const [allPosts, setAllPosts] = useState([]); // Lưu toàn bộ bài viết
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
            console.log(result)
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Không thể tải danh mục bài viết. Vui lòng thử lại sau.");
        } finally {
            setLoading(false); // Set loading false when fetching ends
        }
    };

    // Fetch posts based on selected category
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const result = await getBlog(); // Gọi API lấy toàn bộ bài viết
            setAllPosts(result || []); // Lưu toàn bộ bài viết
            setPosts(result || []); // Hiển thị tất cả bài viết ban đầu
            console.log(result)
        } catch (error) {
            console.error("Error fetching posts:", error);
            toast.error("Không thể tải bài viết. Vui lòng thử lại sau.");
        } finally {
            setLoading(false);
        }
    };

    // Paginate posts
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(posts.length / postsPerPage);

    // Handle category selection
    const handleCategoryClick = (categoryId) => {
        console.log("Selected Category ID:", categoryId);
        if (categoryId === "all") {
            setPosts(allPosts);
        } else {
            const filteredPosts = allPosts.filter(post => post.category_id === Number(categoryId));
            console.log("Filtered Posts:", filteredPosts);
            setPosts(filteredPosts);
        }
    };

    return (
        <div className="container py-2">
            <div className="d-flex row justify-content-between mt-4">
                {/* Left column - Posts and pagination */}
                <div className="col-md-8 row">
                    <p className="font-bold mb-3 text-center text-dGreen fs-20">Danh sách bài viết</p>
                    {loading ? (
                        <div className="row">
                            {[...Array(6)].map((_, index) => (
                                <div key={index} className="col-12 col-md-4 mb-4">
                                    <div className="card bg-hover shadow" style={{borderRadius: '15px', padding: '20px'}}>
                                        <Skeleton height={200} width="100%" />
                                        <div className="card-body">
                                            <Skeleton height={20} width="80%" />
                                            <Skeleton height={20} width="60%" />
                                            <Skeleton height={20} width="50%" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        currentPosts.length > 0 ? (
                            currentPosts.map((post) => (
                                <div className="col-12 col-md-4 mb-4" key={post.id}>
                                    <div className="card bg-hover shadow" style={{borderRadius: '15px', padding: '20px'}}>
                                        <NavLink to={`/postdetail/${post.id}`}>
                                            <img src={post.image} className="card-img-top img-fluid rounded" alt={post.title}
                                                 style={{width: '100%', height: '200px', objectFit: 'cover', borderRadius: '10px'}} />
                                        </NavLink>
                                        <div className="card-body">
                                            <NavLink to={`/postdetail/${post.id}`}>
                                                <p className="card-title font-semibold text-center text-dGreen fs-18">
                                                    {post.title.length > 30 ? post.title.substring(0, 20) + "..." : post.title}
                                                </p>
                                            </NavLink>
                                            <p className="card-text align-content-start text-dGreen" style={{ marginBottom: '1rem' }}>
                                                {post.summary}
                                            </p>
                                            <button className="butn w-100 font-bold rounded shadow" onClick={() => navigate(`/postdetail/${post.id}`)}>
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

                {/* Right column - Post categories */}
                <div className="col-md-4">
                    <p className="font-bold mb-3 text-dGreen fs-20">Danh mục bài viết</p>
                    <ul className="list-group">
                        {loading ? (
                            <li className="list-group-item border-none">
                                <Skeleton height={30} />
                            </li>
                        ) : (
                            <li className={`list-group-item font-semibold d-flex align-items-center border-none cursor-pointer ${selectedCategory === "all" ? "active-category" : ""}`}
                                onClick={() => handleCategoryClick("all")}>
                                <i className="fa fa-list-alt text-dGreen" aria-hidden="true" style={{ marginRight: "6px" }}></i>
                                <p className="text-dGreen m-0">Tất cả bài viết</p>
                            </li>
                        )}
                        {loading ? (
                            <li className="list-group-item border-none">
                                <Skeleton height={30} />
                            </li>
                        ) : (
                            categories.map((category) => (
                                <li className={`list-group-item font-semibold d-flex align-items-center border-none cursor-pointer ${selectedCategory === category.id ? "active-category" : ""}`}
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}>
                                    <i className="fa fa-list-alt text-dGreen" aria-hidden="true" style={{ marginRight: "6px" }}></i>
                                    <p className="text-dGreen" style={{ margin: 0 }}>{category.name}</p>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
