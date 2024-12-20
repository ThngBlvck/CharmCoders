import React, { useEffect, useState, useRef } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { getUserInfo } from "../../../services/User";
import { getMessages, sendMessage } from "../../../services/Message";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getPusher } from "../../../contexts/Pusher";

const Footer = () => {
    const navigate = useNavigate();
    const [showChatModal, setShowChatModal] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [receiverId, setReceiverId] = useState(13);
    const chatWindowRef = useRef(null);
    const scrollToBottom = () => {
        if (chatWindowRef.current) {
            chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
        }
    };
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState([]);

    useEffect(() => {
        scrollToBottom(); // Cuộn xuống mỗi khi tin nhắn thay đổi
    }, [chatMessages]);



    // Fetch user information
    const fetchUserData = async () => {
        try {
            const data = await getUserInfo();
            setUserInfo(data);
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    // Fetch existing messages from the API
    const fetchMessages = async () => {
        try {
            const result = await getMessages(receiverId); // Use receiverId here
            setChatMessages(result);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };

    // Handle sending a message
    const handleSendMessage = async () => {
        setUserMessage("");
        setSelectedImages([]);
        setSelectedImage([]); // Clear hình ảnh đã chọn

        try {
            const formData = new FormData();
            formData.append("receiver_id", receiverId);
            formData.append("message", userMessage);
            selectedImage.forEach((file) => {
                formData.append("image", file);
            });

            await sendMessage(formData); // Gửi `formData` lên server
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };



    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        const pusher = getPusher();
        if (userInfo.user_id && receiverId) {
            const channelName = `chat.${Math.min(userInfo.user_id, receiverId)}_${Math.max(userInfo.user_id, receiverId)}`;
            const channel = pusher.subscribe(channelName);

            const handleMessageEvent = (data) => {
                if (data.product) {
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            message: data.message,
                            sender_id: data.sender.id,
                            receiver: data.receiver,
                            product_id: data.product.id,
                            product: data.product,
                            image: data.image,
                        },
                    ]);
                } else {
                    setChatMessages((prevMessages) => [
                        ...prevMessages,
                        {
                            message: data.message,
                            sender_id: data.sender.id,
                            receiver: data.receiver,
                            product_id: null,
                            product: null,
                            image: data.image,
                        },
                    ]);
                }
                setShowChatModal(true);
            };
            // Bind sự kiện
            channel.bind('App\\Events\\MessageSent', handleMessageEvent);

            // Cleanup: unbind và unsubscribe trước khi component unmount hoặc khi receiverId thay đổi
            return () => {
                channel.unbind('App\\Events\\MessageSent', handleMessageEvent);
                pusher.unsubscribe(channelName);
            };
        }

    }, [userInfo.user_id, receiverId]);


    // Function to open/close the chat modal
    const toggleChatModal = () => {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage

        if (!token) {
            navigate("/login");
            return;
        }

        if (userInfo.role === 2) {
            navigate("/admin/chat");
            return;
        }

        // Nếu có token, mở hoặc đóng modal chat
        setShowChatModal((prevState) => {
            const newState = !prevState;
            if (newState) {
                fetchMessages(); // Lấy tin nhắn cũ khi mở modal chat
            }
            return newState;
        });
    };

    const handleSelectImages = (event) => {
        const files = Array.from(event.target.files);
        setSelectedImage(files);
        const imageUrls = files.map((file) => URL.createObjectURL(file));
        setSelectedImages((prev) => [...prev, ...imageUrls]);
    };

    const handleRemoveImage = (index) => {
        setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    };




    return (
        <>
            <footer className="container-fluid footer py-5" style={{ backgroundColor: '#fff7f8' }}>
                <div className="container py-5">
                    <div className="row g-5">
                        <div className="col-3 col-lg-3 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <NavLink to={`/home`} className="navbar-brand">
                                    <img src="/logo_web.png" className="logo-footer" />
                                </NavLink>
                                <p className="font-bold title text-dGreen fs-16">Liên hệ
                                    chúng tôi</p>
                                <p className="text-dGreen fs-14">
                                    <i className="fas fa-envelope me-2 ic fs-14"></i>
                                    glowmakers6996@gmail.com
                                </p>
                                <p className="text-dGreen fs-14" style={{ marginBottom: "1rem" }}>
                                    <i className="fas fa-phone me-2 ic fs-14"></i>
                                    (+84) 917 88 059
                                </p>
                                <p className="font-bold title text-dGreen fs-16">Phương thức thanh toán</p>
                                <label className="form-check-label mb-2 text-dGreen">
                                    Thanh toán khi nhận hàng
                                </label>
                                <label className="form-check-label mb-2 text-dGreen">
                                    Thanh toán qua MoMo
                                </label>
                            </div>
                        </div>
                        <div className="col-3 col-lg-3 col-xl-3">
                            <div className="footer-item d-flex flex-column">
                                <p className="font-bold title text-dGreen fs-16">Giờ mở cửa</p>
                                <p className="text-dGreen fs-14" style={{ marginBottom: "1rem" }}>Hằng ngày: <span
                                    className="text-dGreen fs-14">08:00 – 22:00</span>
                                </p>
                                <p className="font-bold title text-dGreen fs-14">Địa
                                    chỉ</p>
                                <p className="text-dGreen fs-14"><i
                                    className="fas fa-map-marker-alt me-2 ic fs-14"></i> Toà
                                    nhà FPT Polytechnic, Đ. Số 22, Thường Thạnh, Cái Răng, Cần Thơ</p>
                            </div>
                        </div>
                        <div className="col-3 col-lg-3 col-xl-3">
                            <div className="d-flex flex-column">
                                <p className="font-bold title text-dGreen fs-16 mb-2">Vị trí cửa hàng</p>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31433.785631967043!2d105.75011124306938!3d9.99841296682619!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a08906415c355f%3A0x416815a99ebd841e!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1728871294789!5m2!1svi!2s"
                                    width="300px" height="300px" style={{ border: "0" }} allowFullScreen="" loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                            </div>
                        </div>
                        <div className="col-3 col-lg-3 col-xl-3">
                            <div className="footer-item">
                                <p className="font-bold title text-dGreen fs-14">Về
                                    GlowMakers</p>
                                <p className="text-dGreen fs-14">
                                    GlowMakers là cửa hàng mỹ phẩm chuyên cung cấp các sản phẩm dưỡng da và dưỡng môi
                                    cao cấp, mang lại vẻ đẹp tự nhiên và rạng rỡ cho phái đẹp. Với sứ mệnh giúp bạn tự
                                    tin tỏa sáng, GlowMakers luôn lựa chọn những dòng sản phẩm an toàn, lành tính, chiết
                                    xuất từ thiên nhiên, phù hợp cho mọi loại da.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Back to top button */}
            <button style={{
                position: "fixed", bottom: "20px", right: "80px", zIndex: 1000,
            }}>
                <a href="#" className="butn-top btn-md-square rounded-circle back-to-top">
                    <i className="fa fa-arrow-up"></i>
                </a>
            </button>

            {/* Chat Icon */}
            <button
                className="butn-chat btn-md-square rounded-circle chat-icon"
                style={{
                    position: "fixed", bottom: "30px", right: "80px", zIndex: 1000,
                }}
                onClick={toggleChatModal}
            >
                <i className="fas fa-comments"></i>
            </button>

            {/* Chat Modal */}
            {showChatModal && (
                <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document" style={{ bottom: "-180px", right: "-380px" }}>
                        <div className="modal-content">
                            <div className="modal-header">
                                <p className="modal-title text-dGreen font-semibold fs-16">GlowMaker</p>
                                <p className="modal-title text-dGreen fs-16">Giờ hoạt động: 08:00 - 22:00</p>
                                <i
                                    className="fa fa-times ic text-dGreen fs-20 cursor-pointer"
                                    aria-hidden="true"
                                    onClick={toggleChatModal}
                                ></i>
                            </div>
                            <div className="modal-body" style={{ padding: "0 20px", maxHeight: "400px", overflowY: "auto" }}>
                                <div
                                    className="chat-window"
                                    style={{
                                        maxHeight: "250px",
                                        overflowY: "auto",
                                        height: "250px",
                                        marginBottom: "20px",
                                    }}
                                    ref={(el) => {
                                        chatWindowRef.current = el;
                                        if (el) {
                                            el.scrollTop = el.scrollHeight; // Đặt thanh cuộn ở cuối
                                        }
                                    }}
                                >
                                    {chatMessages.map((msg, index) => (
                                        <div
                                            key={index}
                                            className={`chat-message ${msg.sender_id === userInfo.user_id ? "user" : "admin"}`}
                                            style={{
                                                marginBottom: "10px",
                                                display: "flex",
                                                flexDirection: msg.sender_id === userInfo.user_id ? "row-reverse" : "row",
                                            }}
                                        >
                                            {/* Tin nhắn */}
                                            <div
                                                style={{
                                                    display: "inline-block",
                                                    maxWidth: "70%",
                                                    padding: "10px",
                                                    borderRadius: "12px",
                                                    backgroundColor: msg.sender_id === userInfo.user_id ? "#d4f7c7" : "#f1f1f1",
                                                    color: msg.sender_id === userInfo.user_id ? "#000" : "#333",
                                                    wordWrap: "break-word",
                                                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                                }}
                                            >
                                                <span>{msg.message}</span>

                                                {/* Hiển thị sản phẩm nếu có */}
                                                {msg.product_id && (
                                                    <a href={`/products/${msg.product_id}`} target="_blank" rel="noopener noreferrer">
                                                        <div
                                                            className="product-info"
                                                            style={{
                                                                marginTop: "10px",
                                                                padding: "10px",
                                                                backgroundColor: "#f1f1f1",
                                                                borderRadius: "8px",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "flex-start",
                                                                fontFamily: "Roboto, sans-serif",
                                                                color: "#333",
                                                            }}
                                                        >
                                                            <img
                                                                src={msg.product.image}
                                                                alt="Product"
                                                                style={{
                                                                    width: "60px",
                                                                    height: "60px",
                                                                    objectFit: "cover",
                                                                    marginRight: "10px",
                                                                    borderRadius: "5px",
                                                                    border: "1px solid #ddd",
                                                                }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <h6
                                                                    style={{
                                                                        margin: 0,
                                                                        fontSize: "14px",
                                                                        fontWeight: "600",
                                                                        fontFamily: "Roboto, sans-serif",
                                                                        color: "#333",
                                                                    }}
                                                                >
                                                                    {msg.product.name}
                                                                </h6>

                                                                <div
                                                                    style={{
                                                                        display: "flex",
                                                                        alignItems: "center",
                                                                        marginTop: "5px",
                                                                    }}
                                                                >
                                                                    {msg.product.sale_price && (
                                                                        <span
                                                                            style={{
                                                                                color: "#d32f2f", // Màu đỏ cho giá giảm
                                                                                fontSize: "16px",
                                                                                fontWeight: "bold",
                                                                                fontFamily: "Roboto, sans-serif",
                                                                                marginRight: "10px",
                                                                            }}
                                                                        >
                                                                            {msg.product.sale_price}₫
                                                                        </span>
                                                                    )}

                                                                    <span
                                                                        style={{
                                                                            color: "#888",
                                                                            textDecoration: msg.product.sale_price ? "line-through" : "none", // Gạch ngang nếu có giảm giá
                                                                            fontSize: "12px",
                                                                            fontFamily: "Roboto, sans-serif",
                                                                        }}
                                                                    >
                                                                        {msg.product.unit_price}₫
                                                                    </span>


                                                                </div>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )}

                                                {/* Hiển thị hình ảnh nếu có */}
                                                {msg.image && (
                                                    <div className="mt-3">
                                                        <img
                                                            src={msg.image}
                                                            alt="Message image"
                                                            style={{
                                                                width: "150px",
                                                                height: "150px",
                                                                objectFit: "cover",
                                                                borderRadius: "10px",
                                                                border: "1px solid #ddd", // Thêm đường viền nhẹ
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex space-x-2 overflow-x-auto">
                                    {selectedImages.map((image, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={image}
                                                alt={`Selected ${index}`}
                                                className="w-20 h-20 object-cover rounded"
                                            />
                                            <button
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-sm"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <textarea
                                    className="form-control mt-3"
                                    rows="4"
                                    style={{
                                        resize: "none",
                                        maxHeight: "100px",
                                        overflow: "auto",
                                        width: "100%",
                                    }}
                                    placeholder="Nhập nội dung tin nhắn..."
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault(); // Ngừng việc tạo dòng mới
                                            handleSendMessage(); // Gửi tin nhắn
                                        }
                                    }}
                                />

                            </div>

                            <div
                                className="modal-footer d-flex justify-content-start align-items-center"
                                style={{ margin: "0 10px" }}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleSelectImages}
                                    className="hidden"
                                    id="imageUpload"
                                />
                                <label
                                    htmlFor="imageUpload"
                                >
                                    <i className="fa fa-image text-dGreen fs-20"
                                        style={{
                                            cursor: "pointer",
                                            padding: "10px",
                                            borderRadius: "50%",
                                            backgroundColor: "#d4f7c7",
                                        }}></i>
                                </label>
                                <i
                                    className="fa fa-paper-plane ic text-dGreen fs-20"
                                    aria-hidden="true"
                                    onClick={handleSendMessage}
                                    style={{
                                        cursor: "pointer",
                                        padding: "10px",
                                        borderRadius: "50%",
                                        backgroundColor: "#d4f7c7",
                                    }}
                                ></i>

                            </div>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};


export default Footer;
