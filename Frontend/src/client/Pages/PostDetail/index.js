import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css";

const PostDetail = () => {
    const article = {
        title: "Bài viết mẫu",
        image: "https://via.placeholder.com/600",
        content: "Nội dung chi tiết của bài viết mẫu. Đây là một ví dụ về cách trình bày một bài viết trong ứng dụng của bạn. Bạn có thể thay thế nội dung này bằng bất kỳ thông tin nào bạn muốn."
    };

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (comment) {
            setComments([...comments, comment]);
            setComment("");
        }
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">{article.title}</h2>
            <div className="text-center mb-4">
                <img src={article.image} className="img-fluid rounded" alt={article.title} />
            </div>
            <p className="lead text-justify">{article.content}</p>
            <div className="text-center mt-4">
                <button className="btn btn-secondary" onClick={() => window.history.back()}>
                    Quay lại
                </button>
            </div>

            <div className="mt-5">
                <h5>Bình luận</h5>
                <form onSubmit={handleCommentSubmit} className="mb-3">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập bình luận của bạn"
                            value={comment}
                            onChange={handleCommentChange}
                            required
                        />
                        <button className="btn btn-primary" type="submit">Gửi</button>
                    </div>
                </form>
                <div className="card mt-3">
                    <div className="card-body">
                        <h6 className="card-title">Danh sách bình luận</h6>
                        <ul className="list-group">
                            {comments.length === 0 ? (
                                <li className="list-group-item text-muted">Chưa có bình luận nào.</li>
                            ) : (
                                comments.map((c, index) => (
                                    <li key={index} className="list-group-item">{c}</li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
