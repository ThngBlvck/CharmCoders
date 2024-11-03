import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function GoogleCallback() {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const location = useLocation();

    // On page load, we take "search" parameters
    // and proxy them to /api/auth/callback on our Laravel API
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
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to fetch data');
                }

                const data = await response.json();
                setData(data);

                // Lưu token vào localStorage nếu tồn tại và tải lại trang
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    window.location.reload();  // Tải lại trang web
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search]);

    // Hiển thị khi đang tải

    // Hiển thị khi có lỗi
    if (error) {
        return <DisplayError message={error} />;
    }

    return (
        <div>
            
            <div className="flex items-center justify-center h-screen">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        </div>
    );
}





function DisplayError({ message }) {
    return (
        <div style={{ color: 'red' }}>
            <p>Error: {message}</p>
        </div>
    );
}

export default GoogleCallback;
