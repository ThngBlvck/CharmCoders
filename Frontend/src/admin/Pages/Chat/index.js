import React, { useState, useEffect, useRef } from "react";
import { getListSender, getMessages, sendMessage } from "../../../services/Message";
import { useUser } from '../../../contexts/UserContext';
import { useNavigate } from "react-router-dom";
import { getPusher } from '../../../contexts/Pusher';

const ChatPage = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useUser();
  const navigate = useNavigate();
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState([]);

  // Create a reference to the messages container
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await getListSender();
        setContacts(response || []);
        if (response?.length) {
          const firstContact = response[0];
          setSelectedContact(firstContact);
          fetchMessages(firstContact.sender.id);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();

    const pusher = getPusher();
    const updatedMessage = 'messages';
    const updatedMessageChanel = pusher.subscribe(updatedMessage);
    updatedMessageChanel.bind('App\\Events\\NewMessageReceived', (data) => {
      setContacts((prevContacts) => {
        const senderExists = prevContacts.some(contact => contact.sender.id === data.sender.id);
        if (senderExists) {
          return prevContacts.map(contact => {
            if (contact.sender.id === data.sender.id) {
              contact.latest_message = data.message;
            }
            return contact;
          }).sort((a, b) => a.sender.id === data.sender.id ? -1 : 1);
        } else if (data.sender.id !== user.user_id) {
          return [
            {
              sender: data.sender,
              latest_message: data.message,
              image: data.sender.image
            },
            ...prevContacts
          ];
        }
        return prevContacts;
      });


    });
    return () => {
      updatedMessageChanel.unbind('App\Events\NewMessageReceived');
      pusher.unsubscribe(updatedMessageChanel);
    };

  }, []);

  useEffect(() => {
    const pusher = getPusher();
    if (user.user_id && selectedContact?.sender?.id) {
      const channelName = `chat.${Math.min(user.user_id, selectedContact.sender.id)}_${Math.max(user.user_id, selectedContact.sender.id)}`;
      const channel = pusher.subscribe(channelName);
      channel.bind('App\\Events\\MessageSent', (data) => {
        if (data.product) {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message: data.message,
              sender_id: data.sender.id,
              receiver: data.receiver,
              productid: data.product_id,
              product: data.product,
              isUser: data.sender.id === user.user_id,
              image: data.image
            },
          ]);
        } else {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              message: data.message,
              sender_id: data.sender.id,
              receiver: data.receiver,
              product_id: null,
              product: null,
              isUser: data.sender.id === user.user_id,
              image: data.image
            },
          ]);
        }
      });
      return () => {
        channel.unbind('App\\Events\\MessageSent');
        pusher.unsubscribe(channelName);
      };
    }
  }, [user.user_id, selectedContact]);


  const fetchMessages = async (senderId) => {
    try {
      const result = await getMessages(senderId);
      result.forEach(item => {
        item.isUser = user.user_id === item.sender_id;
      });
      setMessages(result || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage && selectedImage.length === 0) {
      return; // Không gửi nếu không có nội dung hoặc hình ảnh
    }

    setNewMessage("");
    setSelectedImages([]);
    setSelectedImage([]); // Clear hình ảnh đã chọn

    try {
      const formData = new FormData();
      formData.append("receiver_id", selectedContact.sender.id);
      formData.append("message", newMessage);
      selectedImage.forEach((file) => {
        formData.append("image", file);
      });

      await sendMessage(formData); // Gửi `formData` lên server
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    fetchMessages(contact.sender.id);
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
  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-50 font-sans relative">
      {/* Danh sách liên hệ */}
      <div className="w-full sm:w-1/4 bg-indigo-600 text-white shadow-lg">
        <div className="p-4 text-lg font-bold border-b">Danh sách liên hệ</div>
        <ul className="overflow-y-auto h-full">
          {contacts.map((contact) => (
            <li
              key={contact.id}
              onClick={() => handleSelectContact(contact)}
              className={`p-4 cursor-pointer hover:bg-indigo-500 transition-all duration-300 ${selectedContact?.sender.id === contact.sender.id ? "bg-indigo-500" : ""
                }`}
            >
              <div className="flex items-center">
                <img
                  src={contact.sender.image || "/user_default.png"}
                  alt={contact.sender.name}
                  className="w-12 h-12 rounded-full mr-4 bg-white"
                />
                <div>
                  <div className="font-semibold">{contact.sender.name}</div>
                  <div className="text-sm text-indigo-200">{contact.latest_message || "Không có tin nhắn"}</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Nội dung chat */}
      <div className="w-full sm:w-3/4 flex flex-col">
        <div className="p-4 bg-indigo-500 text-white font-bold">
          {selectedContact?.sender.name || "Chọn một liên hệ"}
        </div>
        <div className="flex-grow p-4 overflow-y-auto bg-gray-50 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg max-w-md shadow ${message.isUser ? "bg-indigo-500 text-white" : "bg-gray-300"}`}
                style={{ wordWrap: "break-word", whiteSpace: "pre-wrap", maxWidth: "calc(100% - 100px)" }}
              >
                <p>{message.message}</p>

                {/* Hiển thị ảnh nếu có */}
                {message.image && (
                  <div className="mt-3">
                    <img
                      src={message.image} // Đảm bảo rằng 'message.image' chứa URL hợp lệ
                      alt={`Message image`}
                      className="w-40 h-40 object-cover rounded-lg"
                    />
                  </div>
                )}


                {/* Hiển thị sản phẩm nếu có */}
                {message.product && (
                  <a href={`/products/${message.product.id}`} target="_blank" rel="noopener noreferrer">
                    <div className="mt-3 p-3 rounded-lg bg-gray-100 flex space-x-3" style={{ maxWidth: "300px" }}>
                      <img
                        src={message.product.image}
                        alt="Product"
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm text-gray-700">{message.product.name}</span>

                        {/* Hiển thị giá sản phẩm với điều kiện có giảm giá hay không */}
                        {message.product.sale_price ? (
                          <>
                            <span
                              className="text-xs text-gray-500"
                              style={{ textDecoration: "line-through" }} // Gạch ngang nếu có giảm giá
                            >
                              {message.product.unit_price}₫
                            </span>
                            <span className="text-xs text-red-500 font-semibold mt-1">
                              {message.product.sale_price}₫
                            </span>
                          </>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Giá: {message.product.unit_price}₫
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                )}

              </div>
            </div>
          ))}

          {/* Đảm bảo tự động cuộn đến tin nhắn mới */}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-gray-200 flex flex-col space-y-2">
          {/* Hiển thị ảnh đã chọn */}
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
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Nhập tin nhắn..."
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 px-4 py-2 bg-indigo-500 text-white rounded"
            >
              Gửi
            </button>
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
              className="px-4 py-2 bg-indigo-500 text-white rounded cursor-pointer"
            >
              <i className="fa fa-image text-dBlue fs-20"></i>
            </label>
          </div>
        </div>
      </div>


      {/* Nút Quay lại Admin */}
      <div className="absolute bottom-4 left-4">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all duration-300"
        >
          ⬅️ Quay lại Admin
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
