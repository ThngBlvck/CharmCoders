import React, {useState, useEffect} from 'react';
import "../../../assets/styles/css/bootstrap.min.css";
import "../../../assets/styles/css/style.css";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { login } from "../../../services/User"; // Đảm bảo đã import FontAwesome cho icon

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState(""); // Trạng thái lỗi
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [errors, setErrors] = useState({});
    const [loginUrl, setLoginUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        // Kiểm tra các trường nhập trước khi gửi yêu cầu
        if (!formData.email || !formData.password) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            const response = await login(formData);
            console.log(response);
            if (response && response.token) {
                // Nếu có token trả về, lưu vào localStorage
                console.log("Token:", response.token);
                localStorage.setItem('token', response.token);
                localStorage.setItem('role', response.role);
                window.location.href = "/home"; 
            } else {
                setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error);
            // Xử lý thông báo lỗi từ backend
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    // Nếu có lỗi xác thực từ backend
                    setErrors(errorData.errors); // Gán lỗi cho errors object
                } else {
                    // Nếu không có lỗi xác thực cụ thể
                    setErrorMessage(errorData.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
                }
            } else {
                setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetch('http://localhost:8000/api/auth/google', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Something went wrong!');
            })
            .then((data) => setLoginUrl(data.url))
            .catch((error) => console.error(error));
    }, []);
    
 

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <p className="text-center mb-4 font-bold" style={{color: '#8c5e58', fontSize: "30px"}}>Đăng Nhập</p>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label font-semibold" style={{color: '#8c5e58'}}>Email</label>
                            <input
                                type="email"
                                className="form-control border-0 shadow-sm"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.email[0]}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label font-semibold" style={{color: '#8c5e58'}}>Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            {errors.password && (
                                <div className="text-danger mt-2" role="alert">
                                    {errors.password[0]}
                                </div>
                            )}
                        </div>

                        <div className="mt-3">
                            <a href="/forgot-password" className="text-decoration-none font-semibold" style={{color: '#8c5e58'}}>Quên mật khẩu?</a>
                        </div>

                        <button type="submit" className="btn btn-primary w-100 font-semibold mt-3" style={{color: '#442e2b'}} disabled={loading}>
                            {loading ? "Đang xử lý..." : "Đăng Nhập"}
                        </button>

                        {errorMessage && (
                            <div className="text-danger mt-3" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        {/* Google Login Button */}
                        <div className="text-center mt-3">
                            <p className="font-semibold" style={{color: '#8c5e58'}}>Hoặc đăng nhập bằng</p>
                            <a href={loginUrl} className="btn btn-outline-danger w-100 mt-3">
                                <i className="fab fa-google me-2"></i> Đăng Nhập với Google
                            </a>
                        </div>

                        <div className="mt-3 text-center">
                            <p className="font-semibold" style={{color: '#8c5e58'}}>Bạn chưa có tài khoản? <a href="/register" className="text-decoration-none font-bold" style={{color: '#8c5e58'}}>Đăng ký ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
