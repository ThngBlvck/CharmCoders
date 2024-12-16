import React, { useEffect, useState } from "react";
import "../../../assets/styles/css/style.css";
import "../../../assets/styles/css/bootstrap.min.css";
import { getUserInfo } from "../../../services/User";
import { getMessages, sendMessage } from "../../../services/Message";
import { NavLink } from "react-router-dom";
import Pusher from 'pusher-js';
import { useNavigate } from "react-router-dom";
// Initialize Pusher
Pusher.logToConsole = true;
const pusher = new Pusher('f6f10b97ea3264514f53', {
    cluster: 'ap1',
    forceTLS: true,

});

const Footer = () => {
    const navigate = useNavigate();
    const [showChatModal, setShowChatModal] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [receiverId, setReceiverId] = useState(26);

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
        if (!userMessage.trim()) return; // Kiểm tra tin nhắn rỗng (có thể giữ lại kiểm tra này)

        try {
            // Gửi tin nhắn qua API
            await sendMessage({
                message: userMessage,
                receiver_id: receiverId,
            });

            // Không cần thêm tin nhắn thủ công vào giao diện
            setUserMessage(""); // Xóa trường input sau khi gửi thành công
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
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
                                    glowmakers@gmail.com
                                </p>
                                <p className="text-dGreen fs-14" style={{ marginBottom: "1rem" }}>
                                    <i className="fas fa-phone me-2 ic fs-14"></i>
                                    (+012) 3456 7890 123
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
                                <div className="chat-window" style={{ maxHeight: "250px", overflowY: "auto", height: "250px", marginBottom: "20px" }}>
                                    {chatMessages.map((msg, index) => (
                                        <div key={index} className={`chat-message ${msg.sender_id === userInfo.user_id ? "user" : "admin"}`} style={{ marginBottom: "10px", display: "flex", flexDirection: msg.sender_id === userInfo.user_id ? "row-reverse" : "row" }}>
                                            {/* Tin nhắn */}
                                            <div style={{
                                                display: "inline-block",
                                                maxWidth: "70%",
                                                padding: "10px",
                                                borderRadius: "12px",
                                                backgroundColor: msg.sender_id === userInfo.user_id ? "#d4f7c7" : "#f1f1f1",
                                                color: msg.sender_id === userInfo.user_id ? "#000" : "#333",
                                                wordWrap: "break-word",
                                                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                                            }}>
                                                <span>{msg.message}</span>
                                                {msg.product_id && (
                                                    <a href={`/products/${msg.product_id}`} target="_blank" rel="noopener noreferrer">
                                                        <div className="product-info" style={{
                                                            marginTop: "10px", // Khoảng cách giữa tin nhắn và sản phẩm
                                                            padding: "10px",
                                                            backgroundColor: "#f8f9fa",
                                                            borderRadius: "8px",
                                                            border: "1px solid #ddd",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "space-between"
                                                        }}>
                                                            <img
                                                                src={msg.product.image} // Hình ảnh sản phẩm
                                                                alt="Product"
                                                                style={{
                                                                    width: "50px",
                                                                    height: "50px",
                                                                    objectFit: "cover",
                                                                    marginRight: "10px",
                                                                    borderRadius: "5px"
                                                                }}
                                                            />
                                                            <div style={{ flex: 1 }}>
                                                                <h6 style={{ margin: 0, fontSize: "14px", color: "#333" }}>{msg.product.name}</h6>
                                                                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Giá: {msg.product.unit_price}</p>
                                                                <p style={{ margin: 0, fontSize: "12px", color: "#888" }}>Giảm giá: {msg.product.sale_price}</p>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )}
                                            </div>


                                        </div>
                                    ))}
                                </div>

                                <textarea
                                    className="form-control mt-3"
                                    rows="4"
                                    style={{
                                        resize: "none", maxHeight: "100px", overflow: "auto", width: "100%",
                                    }}
                                    placeholder="Nhập nội dung tin nhắn..."
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) { // Kiểm tra nếu phím Enter được nhấn mà không giữ Shift
                                            e.preventDefault();  // Ngừng việc tạo dòng mới
                                            handleSendMessage();  // Gửi tin nhắn
                                        }
                                    }}
                                />
                            </div>

                            <div className="modal-footer d-flex justify-content-between align-items-center" style={{ margin: "0 10px" }}>
                                <i
                                    className="fa fa-paper-plane ic text-dGreen fs-20"
                                    aria-hidden="true"
                                    onClick={handleSendMessage}
                                    style={{ cursor: "pointer", padding: "10px", borderRadius: "50%", backgroundColor: "#d4f7c7" }}
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
