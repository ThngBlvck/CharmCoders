import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css";

const PostDetail = () => {
    const article = {
        title: "Bài viết mẫu",
        image: "https://via.placeholder.com/600",
        content: "Nội dung chi tiết của bài viết mẫu. Đây là một ví dụ về cách trình bày một bài viết trong ứng dụng của bạn. Bạn có thể thay thế nội dung này bằng bất kỳ thông tin nào bạn muốn."
    };

    const [comment, setComment] = useState('');
    const [commentsList, setCommentsList] = useState([]);

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    // Hàm xử lý khi thêm bình luận
    const handleAddComment = (e) => {
        e.preventDefault();
        if (comment.trim() !== '') {
            setCommentsList([...commentsList, {
                name: "Người dùng",
                text: comment,
                avatar: "https://via.placeholder.com/50"
            }]);
            setComment('');
        }
    };


    return (
        <div className="container py-5">
            <div className="align-content-start" style={{marginTop: "10px", marginBottom: "20px"}}>
                <button className="btn btn-secondary font-semibold" onClick={() => window.history.back()}>
                    Quay lại
                </button>
            </div>
            <p className="text-center mb-4 font-semibold"
               style={{color: '#8c5e58', fontSize: "30px"}}>{article.title}</p>
            <div className="row d-flex justify-content-center">
                <div className="col-md-4">
                    <div className="text-center mb-4">
                        <img src={article.image} className="img-fluid rounded" alt={article.title}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <p className="lead text-justify">{article.content}</p>
                </div>
            </div>

            {/* Form bình luận */}
            <div className="row mt-5">
                <div className="col-12">
                    <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}} className="font-bold">Thêm bình luận</p>
                    <form onSubmit={handleAddComment}>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                rows="4"
                                placeholder="Nhập bình luận của bạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-secondary">
                            Gửi bình luận
                        </button>
                    </form>
                </div>
            </div>

            {/* Hiển thị danh sách bình luận */}
            <div className="row mt-4">
                <div className="col-12">
                    <p style={{color: "#8c5e58", fontSize: "20px", marginBottom: "1rem"}} className="font-bold">Bình luận</p>
                    {commentsList.length > 0 ? (
                        <ul className="list-group">
                            {commentsList.map((comment, index) => (
                                <li key={index} className="list-group-item d-flex align-items-start">
                                    <img src={comment.avatar} alt="Avatar" className="rounded-circle me-2"
                                         style={{ width: '50px', height: '50px' }} />
                                    <div>
                                        <strong>{comment.name}</strong>
                                        <p style={{color: "#8c5e58"}}>{comment.text}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p style={{color: "#8c5e58"}}>Chưa có bình luận nào.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
