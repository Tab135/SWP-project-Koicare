import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const PrivateRoute = ({ allowedRoles }) => {
    const navigate = useNavigate();
    const checkRole = (decodedToken, allowedRoles) => {
        const userRole = decodedToken.role; 
        if (!allowedRoles || allowedRoles.length === 0) return true; 
        return allowedRoles.includes(userRole); 
      };
    useEffect(() => {
        let token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            navigate("/login"); 
        }
    }, [navigate, allowedRoles]);

    return <Outlet />; 
};

export default PrivateRoute;
