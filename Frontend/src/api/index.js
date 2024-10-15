import axios from "axios";
import { Cookies } from "react-cookie";

export const BASE_URL = "http://localhost:8000/api/";

const request = async ({
    method = "GET",
    path = "",
    data = {},
    headers = {},
}) => {
    const token = localStorage.getItem('token');


    try {
        const res = await axios({
            method,
            baseURL: BASE_URL,
            url: path,
            data,
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data; // Trả về dữ liệu từ phản hồi
    } catch (error) {
        // Ném lỗi ra ngoài để có thể xử lý ở nơi gọi
        if (error.response) {
            // Lỗi từ server
            console.error("Server response error:", error.response.data);
            throw error.response.data; // Ném lỗi có chi tiết để xử lý
        } else if (error.request) {
            // Yêu cầu đã được gửi nhưng không nhận được phản hồi
            console.error("Request error:", error.request);
            throw new Error("Không nhận được phản hồi từ server");
        } else {
            // Một lỗi khác xảy ra
            console.error("Error:", error.message);
            throw new Error(error.message);
        }
    }
};

export default request;
