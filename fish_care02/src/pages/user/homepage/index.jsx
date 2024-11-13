import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.scss"
import { ROUTERS } from "../../../utis/router";
import 'react-multi-carousel/lib/styles.css';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { useInView } from 'react-intersection-observer';
import koi from "../../../assets/image/koi.jpg";
import hocakoi from "../../../assets/image/hocakoi.jpg";
import koicricle from "../../../assets/image/koicricle.jpg";
const HomePage = () => {
    const HomeInfoadver = () => {
        const [ref, inView] = useInView({
          triggerOnce: true,  
          threshold: 0.2   
        });
        return (
            <div ref={ref}
            className={`row-home ${inView ? 'animate' : ''}`}>
                        <div className="col-xl-6 col-lg-6 col-md-6">
                            <div className="koicare-advertise">
                                <h4>Are you passionate about Koi fish?</h4>
                                <span>Looking for an all-in-one platform to easily manage your koi pond, water quality, and feeding schedules?</span>
                                <p>Our Koi Care Page is here to help!</p>
                                <p>Start using the Koi Care Page today and give your Koi the best care they deserve!</p>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col advertise-img">
                                <img  src={(koi)} alt="image"/>
                        </div>
            </div>
        );
      };
      const Homeinfotitle1 = () => {
        const [ref, inView] = useInView({
          triggerOnce: true,  
          threshold: 0.3   
        });
        return (
            <div ref={ref}
            className={`row-home ${inView ? 'animate' : ''}`}>
                        <div className="col-xl-6 col-lg-6 col-md-6 col infopondkoi-img">
                                <img  src={(hocakoi)} alt="image"/>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 infopondkoi">
                            <div>
                            <p><strong>Manage Koi Fish:</strong>Keep track of your fish, monitor their growth, and ensure they thrive in the best conditions.</p>
                            <p><strong>Pond Management:</strong>Monitor pond health, maintain cleanliness, and ensure a healthy environment for your Koi.</p>    
                            <p><strong>Water Quality Management:</strong>Monitor pond health, maintain cleanliness, and ensure a healthy environment for your Koi.Monitor pond health, maintain cleanliness, and ensure a healthy environment for your Koi.</p>    
                            </div>   
                        </div>
                       
            </div>
        );
      };
      const Homeinfotitle2 = () => {
        const [ref, inView] = useInView({
          triggerOnce: true,  
          threshold: 0.3   
        });
        return (
            <div ref={ref}
            className={`row-home ${inView ? 'animate' : ''}`}>
                        <div className="col-xl-6 col-lg-6 col-md-6 infocal">
                            <div>
                            <p><strong>Food Calculator:</strong>Calculate the exact amount of food needed based on your Koi's size, growth stage, and water conditions.</p>
                            <p><strong>Salt Calculator:</strong>Adjust salt levels in your pond for optimal fish health.</p>   
                            <p>With Koi Products and Water Care Solutions are suggested to help you take the best possible care of your koi fish</p> 
                         
                            </div>   
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col infocal-img">
                                <img  src={(koicricle)} alt="image"/>
                        </div>
                       
            </div>
        );
      };
    return ( 
        <div className="homepage">
            <div className="home_info">
                <h1>Koi care</h1>
                <div className="container">
                    <div className="HomeInfoadve"><HomeInfoadver/></div>
                    <div className="Homeinfotitle"><Homeinfotitle1/></div>
                    <div className="Homeinfotitle"><Homeinfotitle2/></div>
                    </div>
                </div>
        </div>
    )
};

export default memo(HomePage);