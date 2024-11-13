import './aboutus.css'
const AboutUs = () => {
    return (
        <div className="about-koi-care">
          <h1>About Koi Care</h1>
          <p>Koi fish are beautiful and hardy pets, but they require proper care to thrive. Learn about the essentials of koi care below.</p>
          
          <div className="info-sections">
            <div className="info-card">
              <h2>Pond Setup</h2>
              <p>Set up a spacious pond with a good filtration system to keep koi fish healthy. A deep, well-aerated pond helps them grow and stay active.</p>
            </div>
    
            <div className="info-card">
              <h2>Water Quality</h2>
              <p>Maintaining ideal water parameters is crucial. Regularly monitor pH, ammonia, nitrites, and oxygen levels to ensure your pond stays in balance.</p>
            </div>
    
            <div className="info-card">
              <h2>Feeding</h2>
              <p>Koi fish are omnivores and thrive on a balanced diet of pellets, fresh vegetables, and occasionally, protein like insects.</p>
            </div>
    
            <div className="info-card">
              <h2>Health Monitoring</h2>
              <p>Check for signs of illness, such as changes in appetite or behavior, and treat promptly to prevent diseases from spreading.</p>
            </div>
    
            <div className="info-card">
              <h2>Seasonal Care</h2>
              <p>Adjust feeding and pond maintenance according to the seasons. Koi become less active in winter and need less food.</p>
            </div>
          </div>
                <div className="contact-info"> 
                    <h2>Contact Us</h2> 
                    <p>If you have any questions or need further assistance, feel free to reach out to us:</p> 
                    <p>Email: support@koicare.com</p> 
                    <p>Phone: +123-456-7890</p> 
                    <p>Address: 123 Koi Care Street, Fish Town, FL</p> 
                </div>
        </div>
      );
}
export default AboutUs;