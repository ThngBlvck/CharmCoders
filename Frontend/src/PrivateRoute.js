import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, userRole }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    // Chỉ cho phép truy cập nếu userRole là "admin" hoặc "employee"
    if (userRole !== "admin" && userRole !== "employee") {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
