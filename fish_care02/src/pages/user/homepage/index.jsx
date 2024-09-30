import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.scss"
import { ROUTERS } from "../../../utis/router";
import Carousel from "react-multi-carousel";
import 'react-multi-carousel/lib/styles.css';
import bolocnuoc2 from "../../../assets/imageProduct/water/bolocnuoc2.jpg";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useInView } from 'react-intersection-observer';
import banner1 from "../../../assets/image/banner/banner1.jpg";
import banner2 from "../../../assets/image/banner/banner2.jpg";
import banner3 from "../../../assets/image/banner/banner3.jpg";
import mainkoi from "../../../assets/image/mainkoi.png";
import { GiCirclingFish } from "react-icons/gi";
import { SiSpond } from "react-icons/si";
import { IoWater } from "react-icons/io5";
import { IoStatsChart } from "react-icons/io5";

const HomePage = () => {
    const HomeInfoTitle = () => {
        const [ref, inView] = useInView({
          triggerOnce: true,  
          threshold: 0.2   
        });
        console.log('In view:', inView);
        console.log('Class:', inView ? 'animate' : '');
        return (
            <div ref={ref}
            className={`row-home ${inView ? 'animate' : ''}`}>
                        <div className="col-xl-3 col-lg-3 col-md-3">
                            <div className="koicare-intro">
                                <GiCirclingFish size={70} />
                                <h2>Manage Koi</h2>
                               
                            </div>
                            <div className="koicare-intro">
                                <SiSpond  size={70} />
                                <h2>Manage Pond</h2>
                                
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                        <img className="mainkoi" src={(mainkoi)} alt="image"/>
                        </div>
                        <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3">
                            <div className="koicare-intro">
                                <IoWater size={70}/>
                                <h2>Manage Water</h2>

                            </div>
                            <div className="koicare-intro">
                                <IoStatsChart size={70}/><br/>
                                <h2>Statistics</h2>
                            </div>
                        </div>
            </div>
        );
      };
    const FadeSlider = () => {
        const settings = {
          dots: true,
          infinite: true,
          speed: 500,
          fade: true,
          cssEase: 'linear',
          autoplay: true,       
          autoplaySpeed: 2000,
        };
      
        return (
            <div className="container-home">
                <div className="row">
            <div className="col-xl-12 col-lg-12 col-md-12">
                <Slider {...settings}>
                    <div><img  src={(banner1)} alt="image"/></div>
                    <div><img src={(banner2)} alt="image"/></div>
                    <div><img src={(banner3)} alt="image"/></div>
                </Slider>
            </div>
            </div>
            </div>
        );
      };
    const responsive = {
        superLargeDesktop: {
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
    return ( 
        <div className="homepage">
            <div className="banner">
                    <FadeSlider/>      
            </div>
            <div className="home_info">
                <h1>Koi care</h1>
                <div className="container">
                    <HomeInfoTitle/>
                <div className="home-content">
                    <div className="container">
                        <div className="container-home-content">
                            <h1>Recomendation</h1>
                                <Carousel responsive={responsive} className="container-home-new-slider">
                                    <div className="shop-item">
                                        <div className="shop-item-image">
                                            <img src={(bolocnuoc2)} alt="image"/>
                                        </div>
                                        <div className="shop-item-content">
                                            <div><span>General cure</span>
                                                <p>$500</p>
                                            </div>
                                            <button>buy</button>
                                        </div>   
                                        </div>
                                        <div className="shop-item">
                                        <div className="shop-item-image">
                                            <img src={(bolocnuoc2)} alt="image"/>
                                        </div>
                                        <div className="shop-item-content">
                                            <div><span>General cure</span>
                                                <p>$500</p>
                                            </div>
                                            <button>buy</button>
                                        </div>   
                                        </div>
                                        <div className="shop-item">
                                        <div className="shop-item-image">
                                            <img src={(bolocnuoc2)} alt="image"/>
                                        </div>
                                        <div className="shop-item-content">
                                        <   div><span>General cure</span>
                                                <p>$500</p>
                                            </div>
                                            <button>buy</button>
                                        </div>   
                                        </div>
                                        <div className="shop-item">
                                        <div className="shop-item-image">
                                            <img src={(bolocnuoc2)} alt="image"/>
                                        </div>
                                        <div className="shop-item-content">
                                            <div><span>General cure</span>
                                                <p>$500</p>
                                            </div>
                                            <button>buy</button>
                                        </div>   
                                        </div>
                                </Carousel>
                                <div className="col-xl-12 col-lg-12 col-md-12 news-container">
                                    <h2 className="section-title">News</h2>
                                    <div className="news-card">
                                        <div className="news-image">
                                            <img src="https://www.kodamakoifarm.com/wp-content/uploads/2023/12/Koi-in-Art.jpg"></img>
                                        </div>
                                    <div className="news-info">
                                        <div className="news-header"><strong>[Koi in Art & Literature: Dive into Their Enduring Presence]</strong></div>
                                            <div className="news-content">
                                                <p className="news-content-des">In this article, written by our farm experts and Japanese koi sales specialists, we will delve into the concise history of koi in various art forms, exploring its origins and the artists behind famous works that feature koi as a central theme. We’ll also examine the symbolism associated with koi and uncover why artists choose this captivating aquatic creature as their medium of expression.</p>
                                                <p className="time">2 ngày trước</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="news-card">
                                        <div className="news-image">
                                            <img src="https://www.kodamakoifarm.com/wp-content/uploads/2023/12/Koi-in-Art.jpg"></img>
                                        </div>
                                    <div className="news-info">
                                        <div className="news-header"><strong>[Koi in Art & Literature: Dive into Their Enduring Presence]</strong></div>
                                            <div className="news-content">
                                                <p className="news-content-des">In this article, written by our farm experts and Japanese koi sales specialists, we will delve into the concise history of koi in various art forms, exploring its origins and the artists behind famous works that feature koi as a central theme. We’ll also examine the symbolism associated with koi and uncover why artists choose this captivating aquatic creature as their medium of expression.</p>
                                                <p className="time">2 ngày trước</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="news-card">
                                        <div className="news-image">
                                            <img src="https://www.kodamakoifarm.com/wp-content/uploads/2023/12/Koi-in-Art.jpg"></img>
                                        </div>
                                    <div className="news-info">
                                        <div className="news-header"><strong>[Koi in Art & Literature: Dive into Their Enduring Presence]</strong></div>
                                            <div className="news-content">
                                                <p className="news-content-des">In this article, written by our farm experts and Japanese koi sales specialists, we will delve into the concise history of koi in various art forms, exploring its origins and the artists behind famous works that feature koi as a central theme. We’ll also examine the symbolism associated with koi and uncover why artists choose this captivating aquatic creature as their medium of expression.</p>
                                                <p className="time">2 ngày trước</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                        </div>
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