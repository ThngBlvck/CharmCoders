import axios from "axios";
import { Cookies } from "react-cookie";

export const BASE_URL = "http://localhost:8000/api/";

const request = async ({
                           method = "GET",
                           path = "",
                           data = {},
                           headers = {},
                       }) => {
    try {
        const cookie = new Cookies();
        const token = cookie.get("token");

        const res = await axios({
            method: method,
            baseURL: BASE_URL,
            url: path,
            data: data,
            headers: {
                ...headers,
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        console.log(error?.response?.data?.message || "Error");
        return null;
    }
};

export default request;
