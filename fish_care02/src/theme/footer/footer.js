import { memo } from "react";
import "./footer.css"

const Footer = () => {
    return <footer className="footer">
        <div className="container">
            <div className="row">
            <div className="col-lg-3">
                <div className="sologan">
                     <h1>Đây là footer</h1>
                </div>
            </div>
            <div className="col-lg-3">
                <div className="sologan">
                     <h1>Đây là footer</h1>
                </div>
            </div>
            <div className="col-lg-3">
            <div className="sologan">
                     <h1>Đây là footer</h1>
                </div>
            </div>
            <div className="col-lg-3">
                    <div className="sologan">
                     <h1>Đây là footer</h1>
                </div>
                </div>
            </div>
        </div>
    </footer>;
    
};

export default memo(Footer);