import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import { getOneBlog } from "../../../services/Blog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'; // To format the date

const PostDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [authorName, setAuthorName] = useState(''); // State to store the author's name
    const [loadingPost, setLoadingPost] = useState(true);

    useEffect(() => {
        fetchOnePost();
    }, [id]);

    const fetchOnePost = async () => {
        setLoadingPost(true);
        try {
            const result = await getOneBlog(id); // Fetch post details
            setPost(result);

            // Get the author's name from local storage
            const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming the user info is stored as a JSON object in local storage
            if (loggedInUser) {
                setAuthorName(loggedInUser.name); // Set the author's name from local storage
            }
        } catch (error) {
            console.error("Error fetching post details:", error);
            toast.error('Có lỗi xảy ra khi tải bài viết. Vui lòng thử lại sau.');
        } finally {
            setLoadingPost(false);
        }
    };

    return (
        <div className="container py-5">
            <ToastContainer />
            {loadingPost ? (
                <div className="d-flex flex-column align-items-center">
                    <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '4rem', color: '#8c5e58' }} />
                    <p className="mt-3" style={{ color: '#8c5e58', fontSize: '18px' }}>Đang tải...</p>
                </div>
            ) : post ? (
                <div className="row d-flex justify-content-center">
                    <div className="col-md-8">
                        <p className="text-center mb-4 font-semibold" style={{ color: '#8c5e58', fontSize: "30px" }}>
                            {post.title}
                        </p>
                        <div className="text-center mb-4" style={{ color: '#8c5e58', fontSize: '18px' }}>
                            <span>Tác giả: {authorName}</span> | <span>Ngày đăng: {moment(post.created_at).format('DD/MM/YYYY')}</span>
                        </div>
                        <div
                            className="lead text-justify"
                            style={{ color: '#62433f' }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </div>
            ) : (
                <p>Không tìm thấy bài viết.</p>
            )}
        </div>
    );
};

export default PostDetail;
