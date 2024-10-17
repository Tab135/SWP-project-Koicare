import React, { useState } from "react";
import "./waterpage.scss"; 
import axios from 'axios';

const WaterParameterModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    temperature: '',
    ph: '',
    oxygen: '',
    ammonia: '',
  });

  const toggleModal = () => setShowModal(!showModal);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('/auth/WaterMonitor/addWater', formData)
      .then((response) => {
        console.log(response.data);
        alert('Water parameters added successfully!');
        toggleModal(); 
      })
      .catch((error) => {
        console.error(error);
        alert('Failed to add water parameters. Please try again.');
      });
  };

  return (
    <div>
      <button onClick={toggleModal}>Add Water Parameters</button>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={toggleModal}>
              &times;
            </span>
            <h2>Add Water Parameters</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Temperature (°C):
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                pH Level:
                <input
                  type="number"
                  name="ph"
                  step="0.1"
                  value={formData.ph}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Dissolved Oxygen (mg/L):
                <input
                  type="number"
                  name="oxygen"
                  step="0.1"
                  value={formData.oxygen}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Ammonia (mg/L):
                <input
                  type="number"
                  name="ammonia"
                  step="0.01"
                  value={formData.ammonia}
                  onChange={handleInputChange}
                  required
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