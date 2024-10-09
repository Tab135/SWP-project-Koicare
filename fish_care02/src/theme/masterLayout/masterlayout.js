
import { memo } from "react";
import Header from "../header/header";
import Footer from "../footer/footer"
import cakoi from "../../assets/image/CaKoi.jpg";
const MasterLayout = ({ children, ...props}) =>{
    return (
        <div {...props} style={{backgroundImage: `url(${cakoi})`, backgroundSize: 'cover',       // Ensures the image covers the entire container
        backgroundPosition: 'center',  // Centers the image
        backgroundAttachment: 'fixed'}}>
            <Header/>
            {children}
            <Footer/>
        </div>
    );
};

export default memo(MasterLayout);

