import { memo } from "react";
import "./footer.css"
import logo from "../../assets/image/logo.jpg"
const Footer = () => {
    return <footer className="footer">
        <div className="container">
            <div className="row">
            <div className="col-lg-3">
                <div className="Logo">
                    <div>
                        <img src={(logo)} alt="Logo" />
                    </div>
                     <h1>Koi Care</h1>
                </div>
            </div>
            <div className="col-lg-6">
                <div className="about">
                     <h1>About us</h1>
                </div>
            </div>
            <div className="col-lg-3">
                    <div className="contact">
                     <h1>Contact us </h1>
                </div>
                </div>
            </div>
        </div>
    </footer>;
    
};

export default memo(Footer);