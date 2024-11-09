import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function FacebookCallback() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();  // Sử dụng navigate để chuyển hướng

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/auth/facebook/callback${location.search}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (response.status === 404) {
                    // Chuyển hướng đến trang 404 nếu có lỗi 404
                    navigate('/404');
                    return;
                }

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch data');
                }

                const data = await response.json();
                setData(data);

                // Lưu token vào localStorage nếu tồn tại và tải lại trang
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.reload();
                }
            } catch (err) {
                setError(err.message);
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

    // Hiển thị khi có lỗi khác (không phải 404)
    if (error) {
        return <DisplayError message={error} />;
    }

    return null;
}

function DisplayError({ message }) {
    return (
        <div style={{ color: 'red' }}>
            <p>Error: {message}</p>
        </div>
    );
}

export default FacebookCallback;
