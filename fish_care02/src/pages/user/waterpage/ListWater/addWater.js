
import React, { useState } from "react";
import axios from 'axios';
import "./waterpage.scss"; 
import { IoAddCircleOutline } from "react-icons/io5";
const WaterParameterModal = ({ pond_id }) => {
  const [showModal, setShowModal] = useState(false);
  const formatCurrentDate = () => {
    const currentDate = new Date();
    return currentDate.toLocaleString('en-CA', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      hour12: false
    }).replace(',', ''); 
  };
  const [formData, setFormData] = useState({
    nitrite: '', 
    nitrate: '', 
    phosphate: '', 
    ammonium: '', 
    oxygen: '', 
    hardnessGH: '',
    temperature: '', 
    pH: '', 
    carbonHardnessKH: '', 
    salt: '', 
    co2: '', 
    totalChlorine: '', 
    outdoorTemperature: '', 
    amountFed: '', 
    date: formatCurrentDate(),
  });
  const toggleModal = () => setShowModal(!showModal);
  const getBorderColorForNitrite = (value) => {
    if (value <= 0.1) return 'green';
    if (value > 0.1 && value <= 0.2) return 'orange';
    if (value > 0.2) return 'red';
    return '';
  };
  const getBorderColorForNitrate = (value) => {
    if (value <= 20) return 'green';
    if (value > 20 && value <= 80) return 'orange';
    if (value > 80) return 'red';
    return '';
  };
  const getBorderColorForPhosate = (value) => {
    if (value <= 0.035) return 'green';
    if (value > 0.035 && value <= 1) return 'orange';
    if (value > 1) return 'red';
    return '';
  };
  const getBorderColorForAmmonium = (value) => {
    if (value <= 0.1) return 'green';
    if (value > 0.1 && value <= 0.5) return 'orange';
    if (value > 0.5) return 'red';
    return '';
  };
  const getBorderColorForOxygen = (value) => {
    if (value > 6.5) return 'green';
    if (value > 6 && value <= 6.5) return 'orange';
    if (value <= 6) return 'red';
    return '';
  };
  const getBorderColorForHardness = (value) => {
    if (value <= 21) return 'green';
    if (value > 21) return 'orange';
    return '';
  };
  const getBorderColorTemperature = (value) => {
    if (value >= 5 && value <= 26) return 'green'; 
    if (value >= 4) return 'orange';               
    if (value > 26 && value <= 28) return 'orange'; 
    if  (value < 4) return 'red';
    if (value > 28) return 'red';                   
    return '';
};
const getBorderColorpH = (value) => {
  if (value >= 6.9 && value <= 8) return 'green';        
  if (value >= 6.6 && value < 6.9) return 'orange';      
  if (value > 8 && value <= 8.4) return 'orange';        
  if (value < 6.6) return 'red';                          
  if (value > 8.4) return 'red';                          
  return '';                                            
};
const getBorderColorsalt = (value) => {
  if (value >= 0 && value <= 0.1) return 'green';        
  if (value > 0.1 && value <= 0.6) return 'orange';              
  if (value > 0.6) return 'red';                                                    
  return '';                                            
};
const getBorderColorcarbon = (value) => {
  if (value >= 4) return 'green';        
  if (value >= 1 && value < 4) return 'orange';              
  if (value <= 1) return 'red';                                                    
  return '';                                            
};
const getBorderColorChlorine = (value) => {
  if (value <= 0.001) return 'green';        
  if (value > 0.001 && value <= 0.02) return 'orange';              
  if (value > 0.02) return 'red';                                                    
  return '';                                            
};
const getBorderColorCo2 = (value) => {
  if (value >= 5 && value <=35) return 'green';        
  if (value < 5) return 'orange';   
  if (value > 35 && value <= 150) return 'orange';            
  if (value > 150) return 'red';                                                    
  return '';                                            
};
const calculateCO2 = (carbonHardnessKH, pH) => {
  return (12.839 * carbonHardnessKH * Math.pow(10, (6.37 - pH))).toFixed(2); 
};

const handleInputChange = (e) => {
  const { name, value } = e.target;
  const newValue = value === '' ? '' : parseFloat(value); 

  setFormData((prevData) => {
    const updatedData = {
      ...prevData,
      [name]: newValue,
    };
    if (updatedData.carbonHardnessKH && updatedData.pH) {
      updatedData.co2 = calculateCO2(updatedData.carbonHardnessKH, updatedData.pH);
    }

    return updatedData;
  });
};


  const handleSubmit = (e) => {
    e.preventDefault(); 
  
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!pond_id) {
        alert('Please select a pond first.');
        return;
    }
  
    const formDataWithDate = {
      ...formData,
      date: formatCurrentDate(), 
    };
    console.log(formDataWithDate)
  
  
    axios.post(`http://localhost:8080/user/WaterMonitor/addWater/${pond_id}`, formDataWithDate, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
        console.log('Response Data:', response.data); 
        alert('Water parameters added successfully!');
        toggleModal(); 
    })
    .catch((error) => {
        if (error.response) {
            console.error('Error response:', error.response.data);
            alert(`Failed to add water parameters: ${error.response.data.message || 'Please try again.'}`);
        } else {
            console.error('Error message:', error.message);
            alert('Failed to add water parameters. Please try again.');
        }
    });
  };

  return (
    <div className=" add-water">
      <span className="addWater-button" onClick={toggleModal}><IoAddCircleOutline size={40}/></span>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Add Water Parameters for Pond {pond_id}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Date:
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
     
                />
              </label>
              <label 
                  style={{ 
                    borderColor: formData.nitrite ? getBorderColorForNitrite(parseFloat(formData.nitrite)) : '' 
                  }}
                >
                  Nitrite (mg/L):
                  <input
                    type="number"
                    name="nitrite"
                    step="0.01"
                    value={formData.nitrite}
                    onChange={handleInputChange}
              
                    style={{ 
                      borderColor: formData.nitrite ? getBorderColorForNitrite(parseFloat(formData.nitrite)) : '' 
                    }}
                  />
                </label>

                <label
                 style={{ 
                  borderColor: formData.nitrate ? getBorderColorForNitrate(parseFloat(formData.nitrate) || 0) : '' 
                }}
                >
                Nitrate (mg/L):
                <input
                  type="number"
                  name="nitrate"
                  step="0.01"
                  value={formData.nitrate}
                  onChange={handleInputChange}
              
                  style={{ 
                    borderColor: formData.nitrate ? getBorderColorForNitrate(parseFloat(formData.nitrate) || 0) : '' 
                  }}
                />
              </label>
              <label
                 style={{ 
                  borderColor: formData.phosphate ? getBorderColorForPhosate(parseFloat(formData.phosphate) || 0) : '' 
                }}
              >
                Phosphate (mg/L):
                <input
                  type="number"
                  name="phosphate"
                  step="0.01"
                  value={formData.phosphate}
                  onChange={handleInputChange}
                  
                  style={{ 
                    borderColor: formData.phosphate ? getBorderColorForPhosate(parseFloat(formData.phosphate) || 0) : '' 
                  }}
                />
              </label>
              <label
                     style={{ 
                      borderColor: formData.ammonium ?  getBorderColorForAmmonium(parseFloat(formData.ammonium) || 0) : ''  
                    }}
              >
                Ammonium (mg/L):
                <input
                  type="number"
                  name="ammonium"
                  step="0.01"
                  value={formData.ammonium}
                  onChange={handleInputChange}
               
                  style={{ 
                    borderColor: formData.ammonium ?  getBorderColorForAmmonium(parseFloat(formData.ammonium) || 0) : ''  
                  }}
                />
              </label>
              <label
                      style={{ 
                        borderColor: formData.oxygen ? getBorderColorForOxygen(parseFloat(formData.oxygen) || 0) : '' 
                      }}
              >
                Dissolved Oxygen (mg/L):
                <input
                  type="number"
                  name="oxygen"
                  step="0.01"
                  value={formData.oxygen}
                  onChange={handleInputChange}
             
                  style={{ 
                    borderColor: formData.oxygen ? getBorderColorForOxygen(parseFloat(formData.oxygen) || 0) : '' 
                  }}
                />
              </label>
              <label
                  style={{ 
                    borderColor: formData.hardnessGH ? getBorderColorForHardness(parseFloat(formData.hardnessGH) || 0) : '' 
                  }}
              >
                Hardness GH:
                <input
                  type="number"
                  name="hardnessGH"
                  value={formData.hardnessGH}
                  onChange={handleInputChange}
           
                  style={{ 
                    borderColor: formData.hardnessGH ? getBorderColorForHardness(parseFloat(formData.hardnessGH) || 0) : '' 
                  }}
                />
              </label>
              <label
                 style={{ 
                  borderColor: formData.temperature ? getBorderColorTemperature(parseFloat(formData.temperature) || 0) : '' 
                }}
              >
                Temperature (°C):
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                 
                  style={{ 
                    borderColor: formData.temperature ? getBorderColorTemperature(parseFloat(formData.temperature) || 0) : '' 
                  }}
                />
              </label>
              <label>
                pH:
                <input
                  type="number"
                  name="pH"
                  step="0.01"
                  value={formData.pH}
                  onChange={handleInputChange}
                  style={{ 
                    borderColor: formData.pH ? getBorderColorpH(parseFloat(formData.pH) || 0) : '',
                    color:  formData.pH ? getBorderColorpH(parseFloat(formData.pH) || 0) : ''
                  }}
                />
              </label>
              <label>
                Carbon Hardness KH:
                <input
                  type="number"
                  name="carbonHardnessKH"
                  value={formData.carbonHardnessKH}
                  onChange={handleInputChange}
                  style={{ 
                    borderColor: formData.carbonHardnessKH ? getBorderColorcarbon(parseFloat(formData.carbonHardnessKH) || 0) : '',
                    color: formData.carbonHardnessKH ? getBorderColorcarbon(parseFloat(formData.carbonHardnessKH) || 0) : ''
                  }}
                />
              </label>
              <label>
                Salt (%):
                <input
                  type="number"
                  name="salt"
                  step="0.01"
                  value={formData.salt}
                  onChange={handleInputChange}
                 
                  style={{ 
                    borderColor: formData.salt ? getBorderColorsalt(parseFloat(formData.salt) || 0) : '', 
                    color: formData.salt ? getBorderColorsalt(parseFloat(formData.salt) || 0) : ''
                  }}
                />
              </label>
              <label>
                CO2 (mg/L):
                <input
                  type="number"
                  name="CO2"
                  step="0.01"
                  value={formData.co2}
                  onChange={handleInputChange}
                
                  style={{ 
                    borderColor: formData.co2 ? getBorderColorCo2(parseFloat(formData.co2) || 0) : '', 
                    color: formData.co2 ? getBorderColorCo2(parseFloat(formData.co2) || 0) : ''
                  }}
                />
              </label>
              <label
                 style={{ 
                  borderColor: formData.totalChlorine ? getBorderColorChlorine(parseFloat(formData.totalChlorine) || 0) : '' 
                }}
              >
                Total Chlorine (mg/L):
                <input
                  type="number"
                  name="totalChlorine"
                  step="0.01"
                  value={formData.totalChlorine}
                  onChange={handleInputChange}
                
                  style={{ 
                    borderColor: formData.totalChlorine ? getBorderColorChlorine(parseFloat(formData.totalChlorine) || 0) : '' 
                  }}
                />
              </label>
              <label>
                Outdoor Temperature (°C):
                <input
                  type="number"
                  name="outdoorTemperature"
                  value={formData.outdoorTemperature}
                  onChange={handleInputChange}
                
                />
              </label>
              <label>
                Amount Fed (g):
                <input
                  type="number"
                  name="amountFed"
                  value={formData.amountFed}
                  onChange={handleInputChange}
            
                />
              </label>
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterParameterModal;