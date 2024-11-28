import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { getOneBlog } from "../../../services/Blog";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import { getCommentsByBlogId, addComment, deleteComment } from "../../../services/Comment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Swal from "sweetalert2";
import '@fortawesome/fontawesome-free/css/all.css';
import "../../../assets/styles/css/style.css";

const PostDetail = () => {
    const { id } = useParams();  // Blog post ID from URL parameters
    const [post, setPost] = useState(null);
    const [authorName, setAuthorName] = useState('');
    const [loadingPost, setLoadingPost] = useState(true);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(true);
    const [userId, setUserId] = useState(null);

    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // Load post and comments when the component mounts
    useEffect(() => {
        fetchPostData();
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) setUserId(user.id);
    }, [id]);

    // Fetch post data and comments
    const fetchPostData = async () => {
        setLoadingPost(true);
        setLoadingComments(true);

        try {
            const postResult = await getOneBlog(id);
            setPost(postResult);

            // Adjust author name to match your earlier code, assuming it's stored in localStorage
            const loggedInUser = JSON.parse(localStorage.getItem('user')); // Assuming the user info is stored as a JSON object in local storage
            if (loggedInUser) {
                setAuthorName(loggedInUser.name); // Set the author's name from local storage
            }

            const commentsResult = await getCommentsByBlogId(id);
            setComments(commentsResult);
        } catch (error) {
            toast.error("Không thể tải bài viết hoặc bình luận.");
        } finally {
            setLoadingPost(false);
            setLoadingComments(false);
        }
    };


    // Submit new comment with blog_id and content
    const handleSubmitComment = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId"); // Or decode it from JWT if needed


        // Check if the user is logged in
        if (!token) {
            Swal.fire({
                icon: 'warning',
                title: 'Yêu cầu đăng nhập',
                text: 'Bạn cần đăng nhập để bình luận.',
                confirmButtonText: 'Đăng nhập',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate("/login"); // Redirect to login page
                }
            });
            return;
        }

        // Check if the comment content is empty
        if (!newComment.trim()) {
            toast.warn("Vui lòng nhập nội dung bình luận.");
            return;
        }

        // Prepare the comment data to be sent
        const commentData = {
            blog_id: id,  // Assuming `id` is the blog ID
            user_id: userId, // Assuming `userId` is the logged-in user's ID
            content: newComment.trim(), // Clean up any unnecessary whitespace
        };
            // Send the comment data to the server
            const response = await addComment(commentData);

            // Check if the comment was successfully added
        if (response && response.id) { // Check if the response has an `id`, indicating success
            setNewComment(""); // Reset the comment input
            toast.success("Bình luận đã được thêm thành công.");

            // Fetch the updated list of comments for the blog
            const commentsResult = await getCommentsByBlogId(id);
            setComments(commentsResult); // Update the comments state with the new data
        } else {
            console.error("Error adding comment:", response);
            toast.error("Lỗi. Không thể thêm bình luận.");
        }


    };


    // Delete comment
    const handleDeleteComment = async (commentId) => {
        Swal.fire({
            title: "Bạn chắc chắn muốn xóa bình luận này?",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            icon: "warning",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteComment(commentId);
                    setComments(comments.filter(comment => comment.id !== commentId));
                    toast.success("Bình luận đã được xóa.");
                } catch (error) {
                    toast.error("Không thể xóa bình luận. Vui lòng thử lại.");
                }
            }
        });
    };

    return (
        <div className="container py-5">
            <ToastContainer/>

            <div className="row justify-content-center">
                {/* Post Section */}
                <div className="col-lg-11 col-md-10 mb-5">
                    {loadingPost ? (
                        <div className="d-flex flex-column align-items-center">
                            {/* Skeleton for the entire post */}
                            <Skeleton height={50} width="60%"/> {/* Skeleton for the post title */}
                            <div className="my-3">
                                <Skeleton height={20} width="40%"/> {/* Skeleton for the author name */}
                                <Skeleton height={20} width="30%"/> {/* Skeleton for the date */}
                            </div>
                            <Skeleton count={6} height={20}/> {/* Skeleton for content lines */}
                        </div>
                    ) : post ? (
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-8">
                                <p className="text-center mb-4 font-semibold text-dGreen fs-30">
                                    {post.title}
                                </p>
                                <div className="text-center mb-4 text-success fs-5">
                                    <span>Tác giả: <strong>{authorName}</strong></span> |
                                    <span> Ngày đăng: <strong>{moment(post.created_at).format('DD/MM/YYYY')}</strong></span>
                                </div>

                                <div
                                    className="lead text-justify text-black post-content"
                                    dangerouslySetInnerHTML={{__html: post.content}}
                                />
                            </div>
                        </div>
                    ) : (
                        <p>Không tìm thấy bài viết.</p>
                    )}
                </div>

                {/* Comments Section */}
                <div className="col-lg-10 col-md-8">
                    <div className="comments-section">
                        <h3>Bình luận</h3>
                        <div className="p-4 border rounded bg-white">
                            <form onSubmit={handleSubmitComment} className="mb-4">
                <textarea
                    className="form-control mb-3 "
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Nhập bình luận của bạn..."
                    aria-label="Nhập bình luận"
                />
                                <button
                                    type="submit"
                                    className="btn text-dGreen-comment "

                                    aria-disabled={loadingComments ? "true" : "false"}
                                >
                                    {loadingComments ? (
                                        <FontAwesomeIcon icon={faSpinner} spin/>
                                    ) : (
                                        "Gửi bình luận"
                                    )}
                                </button>
                            </form>

                            {loadingComments ? (
                                <Skeleton count={3} height={50}/>
                            ) : comments.length ? (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="d-flex justify-content-between p-3 border rounded mb-3"
                                    >
                                        <div>
                                            <strong>{comment.user_name}</strong>
                                            <p>{comment.content}</p>
                                        </div>

                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            className="btn text-header-dGreen no-background"
                                            aria-label={`Xóa bình luận của ${comment.user_name}`}
                                        >
                                            <FontAwesomeIcon icon={faTrash}/>
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p>Chưa có bình luận nào.</p>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>


    );
};

export default PostDetail;
