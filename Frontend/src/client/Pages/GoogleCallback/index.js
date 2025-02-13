import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function GoogleCallback() {
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate(); // dùng để điều hướng

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/auth/google/callback${location.search}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();

                // Lưu token vào localStorage nếu tồn tại và tải lại trang
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.reload();  // Tải lại trang web
                } else {
                    throw new Error('Token not found');
                }
            } catch (err) {
                // Điều hướng đến trang 404 nếu có lỗi
                navigate('/404');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search, navigate]);

    // Hiển thị khi đang tải
    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        );
    }

    return null;
}

export default GoogleCallback;
