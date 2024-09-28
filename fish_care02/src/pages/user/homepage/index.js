import { memo, useState } from "react";
import { Link } from "react-router-dom";
import "./homepage.scss"
import { ROUTERS } from "../../../utis/router";
import Carousel from "react-multi-carousel";
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
    return ( 
        <div className="homepage">
            <div className="banner">
                <div className="home_title">
                    <h1>We Care Your KOI</h1>
                </div>       
            </div>
            <div className="home_info">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-3 col-lg-9 home_info_title">
                            <div className="home_info_title">
                                <h1>About koi</h1>
                                <p>
                                Koi, (Cyprinus carpio), any of more than 100 ornamental varieties of carp that are best known for their colourful body patterning and are kept as pets in indoor and outdoor freshwater ponds throughout the world. Koi were raised initially as food fishes in China and Japan. However, they also serve as symbols of friendship, peace, luck, and perseverance and as prominent subjects of Chinese and Japanese folk legends and paintings. Koi, the Japanese word for carp (which also serves as a homophone for “affection”), is a shortened form of the Japanese word nishikigoi, which means “brocaded carp.”
                                </p>
                            </div>
                        </div>
                        <div className="col-xl-3 col-lg-3">
                            <div className="home_info_banner">
                            </div>
                        </div>
                    </div>
                <div className="home-new">
                    <div className="container">
                        <div className="container-home-new">
                            <div><h1>Shop blog</h1></div>
                                <Carousel responsive={responsive} className="container-home-new-slider">
                                    <div>Item 1</div>
                                    <div>Item 2</div>
                                    <div>Item 3</div>
                                    <div>Item 4</div>
                                </Carousel>
                                <div class="news-container">
                                    <h2 class="section-title">News</h2>
                                    <div class="news-card">
            <div class="news-header cakoi">Cá Koi news</div>
            <div class="news-content">
                <p><strong>[Tin cá koi á]</strong>: Săn Đón Dàn Sao Quốc Dân Nghịn Tỷ BP Hoàn Toàn Miễn Phí</p>
                <p class="time">2 ngày trước</p>
            </div>
        </div>
        <div class="news-card">
        <div class="news-header cakoi">Cá Koi news</div>
            <div class="news-content">
                <p><strong>[Tin cá koi á]</strong>: Săn Đón Dàn Sao Quốc Dân Nghịn Tỷ BP Hoàn Toàn Miễn Phí</p>
                <p class="time">2 ngày trước</p>
            </div>
        </div>
        <div class="news-card">
        <div class="news-header cakoi">Cá Koi news</div>
            <div class="news-content">
                <p><strong>[Tin cá koi á]</strong>: Săn Đón Dàn Sao Quốc Dân Nghịn Tỷ BP Hoàn Toàn Miễn Phí</p>
                <p class="time">2 ngày trước</p>
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