import React, { useState } from "react";
import "../../../assets/styles/css/bootstrap.min.css";

const PostDetail = () => {
    const article = {
        title: "Bài viết mẫu",
        image: "https://via.placeholder.com/600",
        content: "Nội dung chi tiết của bài viết mẫu. Đây là một ví dụ về cách trình bày một bài viết trong ứng dụng của bạn. Bạn có thể thay thế nội dung này bằng bất kỳ thông tin nào bạn muốn."
    };

    return (
        <div className="container py-5">
            <p className="text-center mb-4 font-semibold"
               style={{color: '#8c5e58', fontSize: "30px"}}>{article.title}</p>
            <div className="row d-flex justify-content-center">
                <div className="col-md-4">
                    <div className="text-center mb-4">
                        <img src={article.image} className="img-fluid rounded" alt={article.title}/>
                    </div>
                </div>
                <div className="col-md-8">
                    <p className="lead text-justify" style={{color: '#62433f'}}>{article.content}</p>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
