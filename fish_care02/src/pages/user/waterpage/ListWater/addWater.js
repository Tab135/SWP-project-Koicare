
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
   const formatDateForInput = (date) => new Date(date).toISOString().slice(0, 16);
  
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
    date:  formatDateForInput(new Date()) ,
  });
  const toggleModal = () => setShowModal(!showModal);
  const borderColorFunctions = {
    nitrite: (value) => {
        if (value <= 0.1) return 'green';
        if (value > 0.1 && value <= 0.2) return 'orange';
        if (value > 0.2) return 'red';
        return '';
    },
    nitrate: (value) => {
        if (value <= 20) return 'green';
        if (value > 20 && value <= 80) return 'orange';
        if (value > 80) return 'red';
        return '';
    },
    phosphate: (value) => {
        if (value <= 0.035) return 'green';
        if (value > 0.035 && value <= 1) return 'orange';
        if (value > 1) return 'red';
        return '';
    },
    ammonium: (value) => {
        if (value <= 0.1) return 'green';
        if (value > 0.1 && value <= 0.5) return 'orange';
        if (value > 0.5) return 'red';
        return '';
    },
    oxygen: (value) => {
        if (value > 6.5) return 'green';
        if (value > 6 && value <= 6.5) return 'orange';
        if (value <= 6) return 'red';
        return '';
    },
    hardnessGH: (value) => {
        if (value <= 21) return 'green';
        if (value > 21) return 'orange';
        return '';
    },
    temperature: (value) => {
        if (value >= 5 && value <= 26) return 'green';
        if ((value >= 4 && value < 5) || (value > 26 && value <= 28)) return 'orange';
        if (value < 4 || value > 28) return 'red';
        return '';
    },
    pH: (value) => {
        if (value >= 6.9 && value <= 8) return 'green';
        if ((value >= 6.6 && value < 6.9) || (value > 8 && value <= 8.4)) return 'orange';
        if (value < 6.6 || value > 8.4) return 'red';
        return '';
    },
    salt: (value) => {
        if (value >= 0 && value <= 0.1) return 'green';
        if (value > 0.1 && value <= 0.6) return 'orange';
        if (value > 0.6) return 'red';
        return '';
    },
    carbonHardnessKH: (value) => {
        if (value >= 4) return 'green';
        if (value >= 1 && value < 4) return 'orange';
        if (value < 1) return 'red';
        return '';
    },
    totalChlorine: (value) => {
        if (value <= 0.001) return 'green';
        if (value > 0.001 && value <= 0.02) return 'orange';
        if (value > 0.02) return 'red';
        return '';
    },
    co2: (value) => {
        if (value >= 5 && value <= 35) return 'green';
        if (value < 5 || (value > 35 && value <= 150)) return 'orange';
        if (value > 150) return 'red';
        return '';
    }
};
const optimalRanges = {
    nitrite: { min: 0, max: 0.1 },
    nitrate: { min: 0, max: 20 },
    phosphate: { min: 0, max: 0.035 },
    ammonium: { min: 0, max: 0.1 },
    oxygen: { min: 6, max: 8 },
    hardnessGH: { min: 5, max: 21 },
    pH: { min: 6.9, max: 8 },
    co2: { min: 5, max: 35 },
    salt: { min: 0, max: 0.1 },
    carbonHardnessKH: { min: 4, max: 12 },
    totalChlorine: { min: 0, max: 0.001 },
    temperature: { min: 5, max: 26 },
};
  const additionalParameters = {
    amountFed: null, 
    outdoorTemperature: null, 
  };
const calculateCO2 = (carbonHardnessKH, pH) => {
  return (12.839 * carbonHardnessKH * Math.pow(10, (6.37 - pH))).toFixed(2); 
};
const getOutOfRangeInfo = (parameter, value) => {
  const { min, max } = optimalRanges[parameter] || {};
  
  if (min !== undefined && max !== undefined) {
    return value < min
      ? `Below by ${(min - value).toFixed(2)}`
      : value > max
      ? `Above by ${(value - max).toFixed(2)}`
      : "In Range";
  } else {
    return "N/A";
  }
};
const handleInputChange = (e) => {
  const { name, value } = e.target;
  const fieldsToKeepAsString = ["date"];
  const isNumericField = !fieldsToKeepAsString.includes(name);
  if (isNumericField) {
    const newValue = value === '' ? '' : parseFloat(value);
    if (isNaN(newValue)) {
      alert(`${name.charAt(0).toUpperCase() + name.slice(1)} must be a number.`);
      return;
    } else if (newValue < 0) {
      alert(`${name.charAt(0).toUpperCase() + name.slice(1)} cannot be negative.`);
      return;
    }
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
  } else {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
};
const getCurrentDateTime = () => {
  const now = new Date();
  return now.toISOString().slice(0, 16);
};

  const handleSubmit = (e) => {
    e.preventDefault(); 
  
    let token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!pond_id) {
        alert('Please select a pond first.');
        return;
    }
    axios.post(`http://170.64.198.85:8080/user/WaterMonitor/addWater/${pond_id}`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then((response) => {
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
          <div className="water_modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Add Water Parameters for Pond {pond_id}</h2>
            <form onSubmit={handleSubmit}>
          <table>
            <thead>
            <tr>
                <td>Date:</td>
                <td colSpan="3">
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    max={getCurrentDateTime()}
                    onChange={handleInputChange}  
                  />
                </td>
              </tr>
              <tr>
                <th>Parameter</th>
                <th>Value</th>
                <th>Range Optimal</th>
                <th>Out of Range</th>
              </tr>
            </thead>
            <tbody>
                {Object.keys(optimalRanges).map((parameter) => (
                  <tr key={parameter}>
                    <td>{parameter.charAt(0).toUpperCase() + parameter.slice(1)}:</td>
                    <td>
                      <input
                        type="number"
                        name={parameter}
                        step="0.01"
                        value={formData[parameter] || ''}
                        onChange={(e) => handleInputChange(e)}
                        style={{
                          borderColor: formData[parameter]
                            ? borderColorFunctions[parameter](parseFloat(formData[parameter]))
                            : '',
                          color: formData[parameter]
                            ? borderColorFunctions[parameter](parseFloat(formData[parameter]))
                            : '',
                        }}
                      />
                    </td>
                    <td>
                      {optimalRanges[parameter].min} - {optimalRanges[parameter].max}
                    </td>
                    <td>
                      {getOutOfRangeInfo(parameter, parseFloat(formData[parameter] || 0))}
                    </td>
                  </tr>
                ))}
                {Object.keys(additionalParameters).map((parameter) => (
                <tr key={parameter}>
                  <td>{parameter.charAt(0).toUpperCase() + parameter.slice(1)}:</td>
                  <td>
                    <input
                      type="number"
                      name={parameter}
                      step="0.01"
                      value={formData[parameter] || ''}
                      onChange={(e) => handleInputChange(e)}
                    />
                  </td>
                  <td colSpan="2"></td> 
                </tr>
              ))}
              </tbody>
          </table>
          <button type="submit">Submit</button>
        </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterParameterModal;