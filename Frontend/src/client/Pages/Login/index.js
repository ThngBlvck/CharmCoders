import React, { useState, useEffect } from 'react';
import "../../../assets/styles/css/bootstrap.min.css";
import "../../../assets/styles/css/style.css";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { login } from "../../../services/User";

export default function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [GoogleloginUrl, setGoogleLoginUrl] = useState(null);
    const [FacebookloginUrl, setFacebookLoginUrl] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");

        if (!formData.email || !formData.password) {
            setErrorMessage("Vui lòng nhập đầy đủ email và mật khẩu.");
            setLoading(false);
            return;
        }

        try {
            const response = await login(formData);
            if (response && response.token) {
                localStorage.setItem('token', response.token);
                if(response.role == "user"){
                    window.location.href = "/home";
                }else {
                    window.location.href = "/admin";
                }
            } else {
                setErrorMessage("Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.");
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    setErrors(errorData.errors);
                } else {
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
        fetch('http://localhost:8000/api/auth/redirect/google', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((data) => setGoogleLoginUrl(data.url))
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:8000/api/auth/redirect/facebook', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => response.ok ? response.json() : Promise.reject())
            .then((data) => setFacebookLoginUrl(data.url))
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <form onSubmit={handleSubmit} className="border rounded p-4 shadow bg-light">
                        <p className="text-center mb-2 font-bold text-dGreen fs-30">Đăng Nhập</p>

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label font-semibold text-dGreen">Email</label>
                            <input
                                type="email"
                                className="form-control border-0 shadow-sm rounded"
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
                            <label htmlFor="password" className="form-label font-semibold text-dGreen">Mật khẩu</label>
                            <input
                                type="password"
                                className="form-control border-0 shadow-sm rounded"
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
                            <a href="/forgot-password" className="text-decoration-none font-semibold text-dGreen">Quên mật khẩu?</a>
                        </div>

                        <div className="d-flex justify-center">
                            <button type="submit" className="butn rounded w-100 font-semibold mt-3 shadow" disabled={loading}>
                                {loading ? "Đang xử lý..." : "Đăng Nhập"}
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="text-danger mt-3" role="alert">
                                {errorMessage}
                            </div>
                        )}

                        {/* Social Login Buttons */}
                        {/* Social Login Buttons */}
                        <div className="text-center mt-2">
                            <p className="font-semibold mb-2 text-dGreen">Hoặc đăng nhập bằng</p>
                            <div className="d-flex justify-content-center gap-3">
                                <a href={GoogleloginUrl} className="gg shadow d-flex align-items-center px-3 py-2 rounded-pill" style={{ gap: '8px' }}>
                                    <i className="fab fa-google"></i> Google
                                </a>
                                <a href={FacebookloginUrl} className="fb shadow d-flex align-items-center px-3 py-2 rounded-pill" style={{ gap: '8px' }}>
                                    <i className="fab fa-facebook-f"></i> Facebook
                                </a>
                            </div>
                        </div>


                        <div className="mt-2 text-center">
                            <p className="font-semibold text-dGreen">Bạn chưa có tài khoản? <a href="/register" className="text-decoration-none font-bold text-dGreen rt-now">Đăng ký ngay</a></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
