
import React, { useState } from "react";
import axios from 'axios';
import "./waterpage.scss"; 
import { IoAddCircleOutline } from "react-icons/io5";
const WaterParameterModal = ({ pond_id }) => {
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [showMessage, setShowMessage] = useState({
     nitrite: false, 
    nitrate: false, 
    phosphate: false, 
    ammonium: false, 
    oxygen: false, 
    hardnessGH: false,
    temperature: false, 
    pH: false, 
    carbonHardnessKH: false, 
    salt: false, 
    co2: false, 
    totalChlorine: false, 
    outdoorTemperature: false, 
    amountFed: false, 

   });
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
  if (newValue < 0) {
    setError("Value cannot be negative!");
  }else{
  setFormData((prevData) => {
    const updatedData = {
      ...prevData,
      [name]: newValue,
    };
    if (updatedData.carbonHardnessKH && updatedData.pH) {
      updatedData.co2 = calculateCO2(updatedData.carbonHardnessKH, updatedData.pH);
    }

    return updatedData;
  });}
};
const handleToggleMessage = (field) => { setShowMessage((prev) => ({ ...prev, [field]: !prev[field], })); };


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
        window.location.reload();
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
              <label style={{ display: 'flex', alignItems: 'center', position: 'relative' }}> 
                Nitrite (mg/L): 
                <input type="number" 
                name="nitrite" 
                step="0.01"
          
                value={formData.nitrite} 
                onChange={(e) => { 
                  handleInputChange(e); 
                  const value = parseFloat(e.target.value) || 0; 
                  setError(value < 0 ? 'Value cannot be negative' : ''); }} 
                  style={{ borderColor: formData.nitrite ? getBorderColorForNitrite(parseFloat(formData.nitrite)) : '', 
                  marginRight: '5px',
                   color: formData.nitrite ? getBorderColorForNitrite(parseFloat(formData.nitrite)) : '', }} /> 
                   <span onClick={() => handleToggleMessage('nitrite')} 
                   style={{ color: 'red', cursor: 'pointer', marginLeft: '5px', zIndex: 1, }} > ! </span> 
                   {error && ( 
                    <div style={{ position: 'absolute', 
                            right: '0', 
                            top: '100%', 
                            transform: 'translateY(5px)', 
                            backgroundColor: '#f8d7da', 
                            color: '#721c24', 
                            padding: '5px', 
                            borderRadius: '5px', 
                            fontSize: '12px', 
                            zIndex: 2, 
                            whiteSpace: 'nowrap', }} > 
                                {error} 
                    </div> )} 
                    {showMessage.nitrite && ( 
                      <div style={{ position: 'absolute', 
                      right: '0', 
                      top: '100%', 
                      transform: 'translateY(5px)', 
                      backgroundColor: '#f8d7da', 
                      color: '#721c24', padding: '5px', 
                      borderRadius: '5px', 
                      fontSize: '12px', 
                      zIndex: 2, 
                      whiteSpace: 'nowrap', }} > Optimal range: 0 - 0.1 mg/l
                      </div> )} 
                      </label>

                <label
                    style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
                >
                Nitrate (mg/L):
                <input
                  type="number"
                  name="nitrate"
                  step="0.01"
                  value={formData.nitrate}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
              
                  style={{ 
                    borderColor: formData.nitrate ? getBorderColorForNitrate(parseFloat(formData.nitrate) || 0) : '',
                    marginRight: '5px',
                     color: formData.nitrate ? getBorderColorForNitrate(parseFloat(formData.nitrate) || 0) : '',
                  }}
                />
                  <span onClick={() => handleToggleMessage('nitrate')} 
                   style={{ color: 'red', cursor: 'pointer', marginLeft: '5px', zIndex: 1, }} > ! </span> 
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.nitrate && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range: 0 - 20 mg/l
                    </div>
                  )}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  Phosphate (mg/L):
                  <input
                    type="number"
                    name="phosphate"
                    value={formData.phosphate}
                    onChange={(e) => {
                      handleInputChange(e);
                      const value = parseFloat(e.target.value) || 0;
                      setError(value < 0 ? 'Value cannot be negative' : '');
                    }}
                    style={{
                      borderColor: formData.phosphate
                        ? getBorderColorForPhosate(parseFloat(formData.phosphate) || 0)
                        : '',
                        color: formData.phosphate
                        ? getBorderColorForPhosate(parseFloat(formData.phosphate) || 0)
                        : '',
                      marginRight: '5px',
                    }}
                  />
                  <span onClick={() => handleToggleMessage('phosphate')} 
                   style={{ color: 'red', cursor: 'pointer', marginLeft: '5px', zIndex: 1, }} > ! </span> 
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.phosphate && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range: 0 - 0.035 mg/l
                    </div>
                  )}
                </label>
                
              <label
                    style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
              >
                Ammonium (mg/L):
                <input
                  type="number"
                  name="ammonium"
                  step="0.01"
                  value={formData.ammonium}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
               
                  style={{ 
                    borderColor: formData.ammonium ?  getBorderColorForAmmonium(parseFloat(formData.ammonium) || 0) : '',
                    marginRight: '5px',
                    color:  formData.ammonium ?  getBorderColorForAmmonium(parseFloat(formData.ammonium) || 0) : '',
                  }}
                />
                 <span
                    onClick={() => handleToggleMessage('ammonium')} 
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.ammonium && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range: 0 - 0.1 mg/l
                    </div>
                  )}
              </label>
              <label
                      style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
              >
                Dissolved Oxygen (mg/L):
                <input
                  type="number"
                  name="oxygen"
                  step="0.01"
                  value={formData.oxygen}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                  style={{ 
                    borderColor: formData.oxygen ? getBorderColorForOxygen(parseFloat(formData.oxygen) || 0) : '',
                    color:  formData.oxygen ? getBorderColorForOxygen(parseFloat(formData.oxygen) || 0) : '',
                  }}
                />
                 <span
                    onClick={() => handleToggleMessage('oxygen')} 
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.oxygen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range:  6.5 mg/l
                    </div>
                  )}
              </label>
              <label
                 style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
              >
                Hardness GH (°dH):
                <input
                  type="number"
                  name="hardnessGH"
                  value={formData.hardnessGH}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
           
                  style={{ 
                    borderColor: formData.hardnessGH ? getBorderColorForHardness(parseFloat(formData.hardnessGH) || 0) : '',
                    marginRight: '5px',
                    color:  formData.hardnessGH ? getBorderColorForHardness(parseFloat(formData.hardnessGH) || 0) : '',
                  }}
                />
                 <span
                       onClick={() => handleToggleMessage('hardnessGH')} 
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.hardnessGH && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range: 0 - 21 ° dH
                    </div>
                  )}
              </label>
              <label
               style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
              >
                Temperature (°C):
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                 
                  style={{ 
                    borderColor: formData.temperature ? getBorderColorTemperature(parseFloat(formData.temperature) || 0) : '',
                    marginRight: '5px',
                    color:   formData.temperature ? getBorderColorTemperature(parseFloat(formData.temperature) || 0) : '',
                  }}
                />
                 <span
                      onClick={() => handleToggleMessage('temperature')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.temperature && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range: 5 - 26°C
                    </div>
                  )}
              </label>
              <label
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                pH:
                <input
                  type="number"
                  name="pH"
                  step="0.01"
                  value={formData.pH}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                  style={{ 
                    borderColor: formData.pH ? getBorderColorpH(parseFloat(formData.pH) || 0) : '',
                    color:  formData.pH ? getBorderColorpH(parseFloat(formData.pH) || 0) : '',
                    marginRight: '5px',
                  }}
                />
                 <span
                      onClick={() => handleToggleMessage('pH')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.pH && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range: 6.9 - 8
                    </div>
                  )}
              </label>
              <label
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                Carbon Hardness KH (°dH):
                <input
                  type="number"
                  name="carbonHardnessKH"
                  value={formData.carbonHardnessKH}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                  style={{ 
                    borderColor: formData.carbonHardnessKH ? getBorderColorcarbon(parseFloat(formData.carbonHardnessKH) || 0) : '',
                    color: formData.carbonHardnessKH ? getBorderColorcarbon(parseFloat(formData.carbonHardnessKH) || 0) : '',
                    marginRight: '5px',
                  }}
                />
                 <span
                   onClick={() => handleToggleMessage('carbonHardnessKH')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.carbonHardnessKH && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range is more than or equal to 4°dH 
                    </div>
                  )}
              </label>
              <label
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                Salt (%):
                <input
                  type="number"
                  name="salt"
                  step="0.01"
                  value={formData.salt}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                 
                  style={{ 
                    borderColor: formData.salt ? getBorderColorsalt(parseFloat(formData.salt) || 0) : '', 
                    color: formData.salt ? getBorderColorsalt(parseFloat(formData.salt) || 0) : '',
                    marginRight: '5px',
                  }}
                />
                 <span
                    onClick={() => handleToggleMessage('salt')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.salt && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                     Optimal range 0 - 0.1% 
                    </div>
                  )}
              </label>
              <label
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                CO2 (mg/L):
                <input
                  type="number"
                  name="CO2"
                  step="0.01"
                  value={formData.co2}
                  onChange={handleInputChange}
                
                  style={{ 
                    borderColor: formData.co2 ? getBorderColorCo2(parseFloat(formData.co2) || 0) : '', 
                    color: formData.co2 ? getBorderColorCo2(parseFloat(formData.co2) || 0) : '',
                    marginRight: '5px',
                  }}
                />
                 <span
                   onClick={() => handleToggleMessage('co2')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.co2 && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range 5 - 35mg/l
                    </div>
                  )}
              </label>
              <label
                style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
              >
                Total Chlorine (mg/L):
                <input
                  type="number"
                  name="totalChlorine"
                  step="0.01"
                  value={formData.totalChlorine}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                
                  style={{ 
                    borderColor: formData.totalChlorine ? getBorderColorChlorine(parseFloat(formData.totalChlorine) || 0) : '',
                    marginRight: '5px',
                    color:  formData.totalChlorine ? getBorderColorChlorine(parseFloat(formData.totalChlorine) || 0) : '',
                  }}
                />
                 <span
                     onClick={() => handleToggleMessage('totalChlorine')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
                  {showMessage.totalChlorine && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      Optimal range 0 - 0.001mg/l
                    </div>
                  )}
              </label>
              <label
              style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                Outdoor Temperature (°C):
                <input
                  type="number"
                  name="outdoorTemperature"
                  value={formData.outdoorTemperature}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                  }}
                
                />
                 <span
                     onClick={() => handleToggleMessage('outdoorTemperature')}
                    style={{
                      color: 'red',
                      cursor: 'pointer',
                      marginLeft: '5px',
                      zIndex: 1,
                    }}
                  >
                    !
                  </span>
                  {showMessage.outdoorTemperature && (
                    <div
                      style={{
                        position: 'absolute',
                        right: '0',
                        top: '100%',
                        transform: 'translateY(5px)',
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '5px',
                        borderRadius: '5px',
                        fontSize: '12px',
                        zIndex: 2,
                        whiteSpace: 'nowrap',
                      }}
                    >
                     Optimal range: -40 - 40 °C
                    </div>
                  )}
              </label>
              <label>
                Amount Fed (g):
                <input
                  type="number"
                  name="amountFed"
                  value={formData.amountFed}
                  onChange={(e) => {
                    handleInputChange(e);
                    const value = parseFloat(e.target.value) || 0;
                    setError(value < 0 ? 'Value cannot be negative' : '');
                  }}
                />
                  {error && (
                    <div style={{
                      position: 'absolute',
                      right: '0',
                      top: '100%',
                      transform: 'translateY(5px)',
                      backgroundColor: '#f8d7da',
                      color: '#721c24',
                      padding: '5px',
                      borderRadius: '5px',
                      fontSize: '12px',
                      zIndex: 2,
                      whiteSpace: 'nowrap',
                    }}>
                      {error}
                    </div>
                  )}
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