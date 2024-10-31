import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from './contexts/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const PrivateRoute = () => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <FontAwesomeIcon icon={faSpinner} spin size="3x" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" />; 
    }

    if (user.role !== 2 && user.role !== 3) {
        return <Navigate to="/" />; // Nếu không phải admin, chuyển hướng về trang chính
    }

    return <Outlet />;
};

export default PrivateRoute;
