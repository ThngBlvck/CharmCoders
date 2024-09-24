import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../../../assets/styles/css/bootstrap.min.css";

const posts = [
    { id: 1, title: "Bài viết 1", summary: "Tóm tắt nội dung bài viết 1", image: "https://via.placeholder.com/500", category_post: "Danh mục 1" },
    { id: 2, title: "Bài viết 2", summary: "Tóm tắt nội dung bài viết 2", image: "https://via.placeholder.com/500", category_post: "Danh mục 2" },
    { id: 3, title: "Bài viết 3", summary: "Tóm tắt nội dung bài viết 3", image: "https://via.placeholder.com/500", category_post: "Danh mục 3" },
    { id: 4, title: "Bài viết 4", summary: "Tóm tắt nội dung bài viết 4", image: "https://via.placeholder.com/500", category_post: "Danh mục 4" },
    { id: 5, title: "Bài viết 5", summary: "Tóm tắt nội dung bài viết 5", image: "https://via.placeholder.com/500", category_post: "Danh mục 5" },
    { id: 6, title: "Bài viết 6", summary: "Tóm tắt nội dung bài viết 6", image: "https://via.placeholder.com/500", category_post: "Danh mục 6" },
    { id: 7, title: "Bài viết 7", summary: "Tóm tắt nội dung bài viết 7", image: "https://via.placeholder.com/500", category_post: "Danh mục 7" },
    { id: 8, title: "Bài viết 8", summary: "Tóm tắt nội dung bài viết 8", image: "https://via.placeholder.com/500", category_post: "Danh mục 8" }
];

export default function Post() {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 4; // Số bài viết mỗi trang

    // Tính toán bài viết cho trang hiện tại
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

    // Tính tổng số trang
    const totalPages = Math.ceil(posts.length / postsPerPage);

    return (
        <div className="container py-2">
            <div className="container-fluid py-3" style={{ backgroundColor: "#fff7f8"}}>
                <div className="container text-center py-5">
                    <p className="display-3 mb-4" style={{ color: "#ffa69e" }}>Bài viết</p>
                    <ol className="breadcrumb justify-content-center mb-0">
                        <li className="breadcrumb-item font-bold" style={{ color: "#ffa69e" }}>
                            <NavLink to={`/home`}>Trang chủ</NavLink>
                        </li>
                        <li className="breadcrumb-item active font-bold" style={{ color: "#ffa69e" }}>Bài viết</li>
                    </ol>
                </div>
            </div>

            {/* Nội dung chính */}
            <div className="d-flex row justify-content-between mt-4">
                {/* Cột bên trái - Danh mục bài viết */}
                <div className="col-md-3">
                    <p style={{ fontSize: "30px", color: "#8c5e58" }} className="font-bold mb-3">Danh mục bài viết</p>
                    <ul className="list-group">
                        {posts.map((article) => (
                            <li className="list-group-item font-semibold" key={article.id} style={{ border: "none" }}>
                                <i className="fa fa-list-alt" aria-hidden="true" style={{ marginRight: "6px", color: "#8c5e58" }}></i>
                                <NavLink to={`/postdetail`} style={{ color: "#8c5e58" }}>{article.category_post}</NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Cột bên phải - Bài viết và phân trang */}
                <div className="col-md-9 row">
                    <p style={{fontSize: "30px", color: "#8c5e58"}} className="font-bold mb-3 text-center">Danh sách bài
                        viết</p>
                    {currentPosts.map((article) => (
                        <div className="col-4 mb-4" key={article.id}>
                            <div className="card" style={{borderRadius: '15px', padding: '20px'}}>
                                <NavLink to={`/postdetail`}>
                                    <img src={article.image} className="card-img-top" alt={article.title}
                                         style={{maxHeight: '500px', objectFit: 'cover'}}/>
                                </NavLink>
                                <div className="card-body">
                                    <NavLink to={`/postdetail`}>
                                        <p className="card-title font-semibold text-center"
                                           style={{color: "#8c5e58", fontSize: "1.2rem"}}>
                                            {article.title}
                                        </p>
                                    </NavLink>
                                    <p className="card-text align-content-start"
                                       style={{color: "#8c5e58", marginBottom: '1rem'}}>{article.summary}</p>
                                    <button className="btn btn-primary w-100 font-bold"
                                            onClick={() => (window.location.href = "/postdetail")}
                                            style={{color: "#442e2b"}}>Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Phân trang */}
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination pagination-custom">
                                {Array.from({length: totalPages}, (_, index) => (
                                    <li key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    );
}
