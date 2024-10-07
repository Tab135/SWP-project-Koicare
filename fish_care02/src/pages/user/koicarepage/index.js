import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./koicare.scss"
import { ROUTERS } from "../../../utis/router";
import { GiCirclingFish } from "react-icons/gi";
import { SiSpond } from "react-icons/si";
import { IoWater } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import { FaShoppingCart } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import 'react-multi-carousel/lib/styles.css';
const KoiCare = () => {
    const[menus, setmenu] = useState([
        {
            name: 
            (
                <>
                    <GiCirclingFish size={70} />
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
            name:(
                <>
                 <IoStatsChart size={70}/><br/>
                 <span>Statistics</span>
                </>
            ),
            path: "#",
        },
        
        
    ]);
    const[menus1, setmenu1] = useState([
        {
            name: (
                <>
                <FaShoppingCart size={70} />
                <span>Shop</span>
                </>
            ),
            path: ROUTERS.USER.LIST_PONDS,
        },    {
            name: (
                    <>
                    <FaCalculator size={70}/><br/>
                    <span>Salt Caculator</span>
                    </>
            ),
            path: ROUTERS.USER.SALTCAL,
        },
        {
            name: (
                    <>
                    <FaCalculator size={70}/><br/>
                    <span>Food Caculator</span>
                    </>
            ),
            path: ROUTERS.USER.FOODCAL,
        },
        {
            name: 
            (
                <>
                   <FaUsers size={70}/>
                    <span>About Koi care</span>
                </>
            ),
            path: "#",
        },
     
        
        
    ]);
    return ( 
        <div className="koicarepage">
            <div className="container">
                <div className="row">
                    <div className="koicare">
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
                            <div className="menu_banner">
                            <ul>    
                                {
                                     menus1?.map((menu, menukey)=>(
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

export default memo(KoiCare);