import React, { useState } from "react";

const ChatPage = () => {
    const [contacts] = useState([
        { id: 1, name: "John Doe", lastMessage: "How are you?", avatar: "https://via.placeholder.com/50" },
        { id: 2, name: "Jane Smith", lastMessage: "Let's meet tomorrow.", avatar: "https://via.placeholder.com/50" },
        { id: 3, name: "Alice Brown", lastMessage: "Sounds good!", avatar: "https://via.placeholder.com/50" },
    ]);

    const [selectedContact, setSelectedContact] = useState(contacts[0]);

    const [messages, setMessages] = useState([
        { text: "Hi there!", isUser: false, time: "10:30 AM" },
        { text: "Hello, how are you?", isUser: true, time: "10:32 AM" },
    ]);

    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim() !== "") {
            setMessages([...messages, { text: newMessage, isUser: true, time: "10:34 AM" }]);
            setNewMessage("");
        }
    };

    return (
        <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans">
            {/* Danh sách người nhắn */}
            <div className="w-1/4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg flex flex-col justify-between">
                <div>
                    <div className="p-6 text-xl font-bold border-b border-indigo-300">Danh sách liên hệ</div>
                    <ul className="overflow-y-auto h-[calc(100%-60px)]">
                        {contacts.map((contact) => (
                            <li
                                key={contact.id}
                                onClick={() => setSelectedContact(contact)}
                                className={`flex items-center p-4 cursor-pointer hover:bg-indigo-400 transition-all duration-300 ${
                                    selectedContact.id === contact.id ? "bg-indigo-400" : ""
                                }`}
                            >
                                <img
                                    src={contact.avatar}
                                    alt={contact.name}
                                    className="w-12 h-12 rounded-full mr-4 border-2 border-white shadow"
                                />
                                <div>
                                    <div className="font-semibold">{contact.name}</div>
                                    <div className="text-sm truncate text-indigo-200">{contact.lastMessage}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Nút quay lại Admin */}
                <div className="p-4">
                    <button
                        onClick={() => (window.location.href = "/admin")}
                        className="w-full flex items-center justify-center px-4 py-3 text-lg font-medium text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-lg hover:opacity-90 transition-opacity duration-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                        Quay lại Admin
                    </button>
                </div>
            </div>

            {/* Nội dung và trò chuyện */}
            <div className="w-3/4 flex flex-col bg-white shadow-lg">
                {/* Tiêu đề */}
                <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center">
                    <img
                        src={selectedContact.avatar}
                        alt={selectedContact.name}
                        className="w-10 h-10 rounded-full mr-4 border-2 border-white"
                    />
                    <div className="font-bold text-lg">{selectedContact.name}</div>
                </div>

                {/* Khu vực tin nhắn */}
                <div className="flex-grow p-6 overflow-y-auto bg-gray-100 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${
                                message.isUser ? "justify-end" : "justify-start"
                            }`}
                        >
                            <div
                                className={`relative p-4 rounded-3xl max-w-xs shadow ${
                                    message.isUser
                                        ? "bg-indigo-500 text-white"
                                        : "bg-gray-300 text-gray-900"
                                }`}
                            >
                                <p>{message.text}</p>
                                <span className="absolute text-xs text-gray-500 bottom-1 right-2">
                                    {message.time}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nhập tin nhắn */}
                <div className="p-6 bg-gray-200 border-t border-gray-300 flex items-center">
                    <input
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        className="flex-grow p-4 border border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                        onClick={handleSendMessage}
                        className="ml-4 px-6 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 shadow-lg transition-all duration-300"
                    >
                        Gửi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
