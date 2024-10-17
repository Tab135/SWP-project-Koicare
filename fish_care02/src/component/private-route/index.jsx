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
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login"); 
        } else {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;
                console.log("Currenttime: ",currentTime);
                console.log("exp: ",decodedToken.exp);
                } catch (error) {
                  return false;
            } 
        }
    }, [navigate, allowedRoles]);

    return <Outlet />; 
};

export default PrivateRoute;
