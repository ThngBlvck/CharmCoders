import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import "../../../assets/styles/css/bootstrap.min.css";

const posts = [
    {
        id: 1,
        title: "Bài viết 1",
        summary: "Tóm tắt nội dung bài viết 1",
        image: "https://via.placeholder.com/300"
    },
    {
        id: 2,
        title: "Bài viết 2",
        summary: "Tóm tắt nội dung bài viết 2",
        image: "https://via.placeholder.com/300"
    },
    {
        id: 3,
        title: "Bài viết 3",
        summary: "Tóm tắt nội dung bài viết 3",
        image: "https://via.placeholder.com/300"
    },
];

export default function Post() {
    const [articles] = useState(posts);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleViewDetails = (article) => {
        navigate(`/articles/${article.id}`, { state: { article } }); // Navigate to the details page
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Danh Sách Bài Viết</h2>
            <div className="row">
                {articles.map(article => (
                    <div className="col-md-4 mb-4" key={article.id}>
                        <div className="card">
                            <img src={article.image} className="card-img-top" alt={article.title} />
                            <div className="card-body">
                                <h5 className="card-title">{article.title}</h5>
                                <p className="card-text">{article.summary}</p>
                                <button className="btn btn-primary" onClick={() => window.location.href = '/postdetail'}>
                                    Xem Chi Tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
