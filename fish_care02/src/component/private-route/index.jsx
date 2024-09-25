import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateRoute = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");  // Chuyển hướng tới trang login nếu không có token
        } 
    }, [navigate]);

    return <Outlet />; // Render các route con
};

export default PrivateRoute;