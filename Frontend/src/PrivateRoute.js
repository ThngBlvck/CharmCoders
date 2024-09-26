import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, userRole }) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    if (userRole !== "admin") {
        return <Navigate to="/" />;
    }

    return <Outlet />; 
};

export default PrivateRoute;
