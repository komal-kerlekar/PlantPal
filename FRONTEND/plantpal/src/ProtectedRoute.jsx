import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        setLoading(false);
    }, []);

    if (loading) return <div>Loading...</div>;

    if (!token) {
        return <Navigate to="/auth" replace />;
    }

    return children;
};

export default ProtectedRoute;