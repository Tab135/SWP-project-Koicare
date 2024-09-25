import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.scss"
import { ROUTERS } from "../../../utis/router";
import { GiCirclingFish } from "react-icons/gi";
import { SiSpond } from "react-icons/si";
import { IoWater } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";

import 'react-multi-carousel/lib/styles.css';
const HomePage = () => {
    const[menus, setmenu] = useState([
        {
            name: 
            (
                <>
                    <GiCirclingFish size={70} /><br/>
                    <span>Koi</span>
                </>
            ),
            path: "#",
        },
        {
            name: (
                <>
                <SiSpond  size={70} /><br/>
                <span>Pond</span>
                </>
            ),
            path: ROUTERS.USER.LIST_PONDS,
        },      {
            name:   (
                <>
                    <IoWater size={70}/><br/>
                    <span>Water</span>
                </>
            ),
            path: "#",
        },
        {
            name: (
                    <>
                    <FaCalculator size={70}/><br/>
                    <span>Caculator</span>
                    </>
            ),
            path: "#",
            isShowSubmenu: false,
            child:[
                {
                    name: "Food Caculator",
                    path: "",
                },
                {
                    name: "Salt Caculator",
                    path: "",
                },
            ],
        },
        {
            name:(
                <>
                 <IoStatsChart size={70}/><br/>
                 <span>Statistics</span>
                </>
            ),
            path: "#",
        },
        
        
    ]);
    return ( 
        <div className="homepage">
            <div className="container">
                <div className="row">
                    <div className="banner">
                            <div className="text_banner">
                                <h1>KOi Fish care System</h1>
                            </div>
                            <div className="menu_banner">
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
                </div>
            </div>
            <div>

            </div>
        </div>
    )
};

export default memo(HomePage);