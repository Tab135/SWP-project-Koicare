import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.scss"
import { ROUTERS } from "../../../utis/router";
import { GiCirclingFish } from "react-icons/gi";
import { SiSpond } from "react-icons/si";
import { IoWater } from "react-icons/io5";
import { FaCalculator } from "react-icons/fa6";
import { IoStatsChart } from "react-icons/io5";
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
const HomePage = () => {
    const responsive = {
        superLargeDesktop: {
          // the naming can be any, depends on you.
          breakpoint: { max: 4000, min: 3000 },
          items: 5
        },
        desktop: {
          breakpoint: { max: 3000, min: 1024 },
          items: 3
        },
        tablet: {
          breakpoint: { max: 1024, min: 464 },
          items: 2
        },
        mobile: {
          breakpoint: { max: 464, min: 0 },
          items: 1
        }
      };
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
            path: "#",
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
                <div className="recommendations">
                    <div className="title_recom">
                    <h2>Product recommendations</h2>
                    </div>
                    <div className="water_product">
                        <div className="title_water_product">
                            <h3>Water treatment</h3>
                        </div>
                        <div>
                        <Carousel responsive={responsive}>
                            <div className="water_treatment">Superior Pump 91250 1800GPH Thermoplastic Submersible Utility Pump with 10-Foot Cord, 1/4 HP</div>
                            <div className="water_treatment">Superior Pump 99621 Lay-Flat Discharge Hose Kit, 1-1/2-Inch by 25-foot</div>
                            <div className="water_treatment">Superior Pump 99621 Lay-Flat Discharge Hose Kit, 1-1/2-Inch by 25-foot</div>
                            <div className="water_treatment">Superior Pump 99621 Lay-Flat Discharge Hose Kit, 1-1/2-Inch by 25-foot</div>
                        </Carousel>
                        </div>
                    </div>
                    <div className="koi_product">
                        <div className="title_koi_product">
                            <h3>Koi treatment</h3>
                        </div>  
                        <div>
                        <Carousel responsive={responsive}>
                            <div>Item 1</div>
                            <div>Item 2</div>
                            <div>Item 3</div>
                            <div>Item 4</div>
                        </Carousel>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default memo(HomePage);