import { memo, useState } from "react";
import { ROUTERS } from "../../utis/router";
import { Outlet,Link } from "react-router-dom";
import "./header.css"
import { FaUserAlt } from "react-icons/fa";
import { RiLoginBoxFill } from "react-icons/ri";
const Header = () => {
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
                        <h1><Link>KOI</Link></h1>                 
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
                    <div className="header_login">
                            <div ><Link to={ROUTERS.USER.LOGIN}><RiLoginBoxFill /></Link></div>
                            <div>
                                    <FaUserAlt />
                            </div>        
                    </div>
                </div>
            </div>
        </div>
        <Outlet />
    </div>
    );
    
};

export default memo(Header);