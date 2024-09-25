import { memo, useState } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet,Link } from "react-router-dom";
import "./header.scss"
import logo from "../../assets/image/logo.jpg"
import React, { useEffect} from 'react';
import { getUsernameFromToken } from '../../utis/gettoken';
const Header = () => { 
    const [username, setUsername] = useState(null);
    const UserProfile = () => {
       

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (token) {
                const name = getUsernameFromToken(token);
                setUsername(name);
            }
        }, []);

        return (
            <div className="header_login">
                {username ? (
                    <LogoutButton username={username} />
                ) : (
                    <Link to={ROUTERS.USER.LOGIN}>Login</Link>
                )}
            </div>
        );
        
    };

    const LogoutButton = ({ username }) => {

        const handleLogout = () => {
            localStorage.removeItem("token"); 
            setUsername(null); 
        };

        return (
            <div>
                <span>Welcome, {username}!</span>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        );
    };
    const[menus, setmenu] = useState([
        {
            name: "Home",
            path: ROUTERS.USER.HOME,
        },
        {
            name: "Shop",
            path: ROUTERS.USER.SHOP,
        },      {
            name: "Blog",
            path: ROUTERS.USER.BLOG,
        },      {
            name: "Contact",
            path: ROUTERS.USER.CONTACT,
        },
        
    ]);
    return (
    <div className="header">
        <div className="container">
            <div className="row">
                <div className="col-xl-3 col-lg-3">
                    <div className="header_logo">
                    <img src={(logo)} alt="Logo" />       
                    </div>
                </div>
                <div className="col-xl-3 col-lg-6">
                    <div className="header_menu">
                        <ul>
                            {
                                menus?.map((menu, menukey)=>(
                                    <li key={menukey}>
                                        <Link to={menu.path}className="menu">{menu?.name}</Link>
                                    </li>
                                )) 
                            }
                        </ul>
                    </div>
                </div>
                <div className="col-xl-3 col-lg-3">
                            {/* <div >{username ? (
                        <h1>Welcome, {username}!</h1>
                            ) : (
                                <Link to={ROUTERS.USER.LOGIN}>Login</Link>
                                )}</div>       */}
                                <UserProfile/>

                </div>
            </div>
        </div>
        <Outlet />
    </div>
    );
    
};

export default memo(Header);