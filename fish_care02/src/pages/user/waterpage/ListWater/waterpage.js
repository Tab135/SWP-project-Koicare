import WaterParameterModal from "./addWater";
import PondDropdown from "./PondDropdown";
import React, { useEffect,useState } from 'react';
import axios from "axios";
import { MdOutlineCancel } from "react-icons/md";
import Modal from 'react-modal';
import WaterDetailsModal from "./WaterDetailsModal";

Modal.setAppElement('#root');
const WaterPage = () => {
    const [PondId, setPondId] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedWater, setSelectedWater] = useState(null);
    const [waterDetails, setWaterDetails] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);
    const [updatedDetails, setUpdatedDetails] = useState({
        nitrite: '',
        nitrate: '',
        phosphate: '',
        ammonium: '',
        pH: '',
        temperature: '',
        salt: '',
        co2: '',
        oxygen: ''
    });
    const calculateCO2 = (carbonHardnessKH, pH) => {
        return (12.839 * carbonHardnessKH * Math.pow(10, (6.37 - pH))).toFixed(2); 
      };
    const openModal = (water) => {
        setSelectedWater(water);
        fetchWaterDetails(water.id);
        setModalIsOpen(true);
        setIsEditMode(false);  
    };
    ;

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedWater(null);
        setWaterDetails(null);
    };
    const formatDisplayDate = (isoDate) => {
        return new Date(isoDate).toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        setUpdatedDetails((prevDetails) => {
            const updatedDetails = {
                ...prevDetails,
                [name]: value,
            };
            const carbonHardnessKH = parseFloat(updatedDetails.carbonHardnessKH);
            const pH = parseFloat(updatedDetails.pH);
            
            if (!isNaN(carbonHardnessKH) && !isNaN(pH)) {
                updatedDetails.co2 = calculateCO2(carbonHardnessKH, pH);
            }
    
            return updatedDetails;
        });
    };
    const handleSave = async () => {
        try {
            let token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const waterId = selectedWater.id;
            await axios.put(`http://170.64.198.85:8080/user/WaterMonitor/updateWater/${waterId}`, updatedDetails,  config);
            alert('Water details updated successfully');
            closeModal();
        } catch (error) {
            console.error('Failed to update water details:', error);
            alert('Error updating water details');
        }
    };

    const fetchWaterDetails = async (waterId) => {
        try {
            let token = localStorage.getItem('token') || sessionStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            const response = await axios.get(`http://170.64.198.85:8080/user/WaterMonitor/WaterDetail/${waterId}`, config);
            setWaterDetails(response.data.waterModel); 
            setUpdatedDetails(response.data.waterModel);
        } catch (error) {
            console.error("Error fetching water details", error);
        }
    };
    const WaterList = ({pondId}) => {
            const [waters, setWater] = useState([]);
            const [error, setError] = useState(null);
            const [successMessage, setSuccessMessage] = useState(null);
            useEffect(() => {
                const fetchWaters = async () => {
                    try {
                        let token = localStorage.getItem('token');
                        if (!token) {
                            token = sessionStorage.getItem('token');
                        }
                        const config = {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        };
                        const response = await axios.get(`http://170.64.198.85:8080/user/WaterMonitor/getWater/${pondId}`, config);
                        setWater(response.data.waterModelList);
                    } catch (error) {
                        console.error("Error fetching ponds", error);
                        setError("Could not fetch ponds.");
                    }
                };
        
                fetchWaters();
            }, []);
            const handleDeletePond = async (id) => {
                const confirmDelete = window.confirm("Are you sure you want to delete this pond?");
                if (!confirmDelete) return;
        
                try {
                    let token = localStorage.getItem('token');
                    if (!token) {
                        token = sessionStorage.getItem('token');
                    }
                    const config = {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    };
                    const response = await axios.delete(`http://170.64.198.85:8080/user/WaterMonitor/deleteWater/${id}`, config);
        
                    if (response.status === 200) {
                        setWater(prevPonds => prevPonds.filter(water => water.id !== id));
                        setSuccessMessage("Pond deleted successfully!");
                    } else {
                        setError("Could not delete pond.");
                    }
                } catch (error) {
                    console.error("Error deleting pond", error);
                    setError("An error occurred. Please try again.");
                }
            };
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
    const isAnyParameterRed = (water) => {
        return (
            getBorderColorForNitrite(water.nitrite) === 'red' ||
            getBorderColorForNitrate(water.nitrate) === 'red' ||
            getBorderColorForPhosate(water.phosphate) === 'red' ||
            getBorderColorForAmmonium(water.ammonium) === 'red' ||
            getBorderColorForHardness(water.hardnessGH) === 'red' ||
            getBorderColorForOxygen(water.oxygen) === 'red' ||
            getBorderColorCo2(water.co2) === 'red' ||
            getBorderColorTemperature(water.temperature) === 'red' ||
            getBorderColorpH(water.pH) === 'red' ||
            getBorderColorcarbon(water.carbonHardnessKH) === 'red' ||
            getBorderColorsalt(water.salt) === 'red' ||
            getBorderColorChlorine(water.totalChlorine) === 'red'
        );
    };

    const isAnyParameterOrange = (water) => {
        return (
            getBorderColorForNitrite(water.nitrite) === 'orange' ||
            getBorderColorForNitrate(water.nitrate) === 'orange' ||
            getBorderColorForPhosate(water.phosphate) === 'orange' ||
            getBorderColorForAmmonium(water.ammonium) === 'orange' ||
            getBorderColorForHardness(water.hardnessGH) === 'orange' ||
            getBorderColorForOxygen(water.oxygen) === 'orange' ||
            getBorderColorCo2(water.co2) === 'orange' ||
            getBorderColorTemperature(water.temperature) === 'orange' ||
            getBorderColorpH(water.pH) === 'orange' ||
            getBorderColorcarbon(water.carbonHardnessKH) === 'orange' ||
            getBorderColorsalt(water.salt) === 'orange' ||
            getBorderColorChlorine(water.totalChlorine) === 'orange'
        );
    }; 
    const getBorderColorForWaterCard = (water) => {
        if (isAnyParameterRed(water)) {
            return '2px solid red';
        } else if (isAnyParameterOrange(water)) {
            return '2px solid orange';
        }
        return '2px solid green';
    };
        return(
                <div className="water-list-container">
                    {error && <p className="error-message">{error}</p>}
                    {successMessage && <p className="success-message">{successMessage}</p>}
                    <div className="water-grid">
                        {Array.isArray(waters) && waters.length > 0 ? (
                            waters.sort((a, b) => new Date(b.date) - new Date(a.date)) 
                            .map((water) => (
                                <div 
                                key={water.id} 
                                className="water-card"
                                style={{ 
                                    border: getBorderColorForWaterCard(water) 
                                }}
                                onClick={() => openModal(water)}
                            >
                            <div className="water-content">
                                <div className="water-contentheader">
                                <div className="water-date">
                                <p><strong>Date:</strong> {formatDisplayDate(water.date)}</p>
                                </div >
                                    <div className="water_close_button"  onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleDeletePond(water.id);
                                            }}>
                                        {waters.length > 1 && (
                                            <span
                                                className="close">
                                                <MdOutlineCancel />
                                            </span>
                                        )} 
                                    </div> 
                                </div>
                                <div className="water-details">
                                    <div className="water-details1">
                                    <p>
                                        <strong>Nitrite:</strong>{" "}
                                        <span
                                            style={{
                                            color: getBorderColorForNitrite(water.nitrite),
                                            }}
                                        >
                                            {water.nitrite} mg/L
                                        </span>
                                    </p>
                                    <p><strong>Nitrate:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorForNitrate(water.nitrate),
                                            }}
                                        >
                                            {water.nitrate} mg/L
                                        </span>
                                    </p>
                                    <p><strong>Phosphate:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorForPhosate(water.phosphate),
                                            }}
                                        >
                                            {water.phosphate} mg/L
                                        </span>
                                    </p>
                                    <p><strong>ammonium:</strong> {" "} 
                                    <span
                                            style={{
                                            color: getBorderColorForAmmonium(water.ammonium),
                                            }}
                                        >
                                            {water.ammonium} mg/L
                                        </span>    
                                    </p>
                                    <p><strong>hardnessGH:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorForHardness(water.hardnessGH),
                                            }}
                                        >
                                            {water.hardnessGH}°dH
                                        </span> 
                                    </p>
                                    <p><strong>Oxygen:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorForOxygen(water.oxygen),
                                            }}
                                        >
                                            {water.oxygen} mg/L
                                        </span> 
                                    </p>
                                    <p><strong>CO2:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorCo2(water.co2),
                                            }}
                                        >
                                            {water.co2} mg/L
                                        </span> 
                                    </p>
                                    </div>
                                    <div className="water-details2">
                                    <p><strong>Temperature:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorTemperature(water.temperature),
                                            }}
                                        >
                                            {water.temperature} °C
                                        </span>
                                     </p>
                                    <p><strong>pH:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorpH(water.pH),
                                            }}
                                        >
                                            {water.pH} 
                                        </span>
                                    </p>
                                    <p><strong>carbonHardnessKH:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorcarbon(water.carbonHardnessKH),
                                            }}
                                        >
                                            {water.carbonHardnessKH} °dH
                                        </span>
                                    </p>
                                    <p><strong>Salt:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorsalt(water.salt),
                                            }}
                                        >
                                            {water.salt} %
                                        </span>
                                    </p>
                                    <p><strong>Total Chlorine:</strong> {" "}
                                    <span
                                            style={{
                                            color: getBorderColorChlorine(water.totalChlorine),
                                            }}
                                        >
                                            {water.totalChlorine} mg/L
                                        </span>
                                    </p>
                                    <p><strong>Amount Fed:</strong> {water.amountFed} g</p>
                                    <p><strong>Outdoor Temperature:</strong> {water.outdoorTemperature} °C</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Water available.</p>
                )}
        </div>
        </div>
        )
}   

return (
    <div className="WaterPage">
        <h1>Water Parameter</h1>
        <div className="container">
            <div className="row">
                <div className='col-lg-6 pond-name'><PondDropdown setPondId={setPondId} /></div>
                <div className="col-lg-6"><WaterParameterModal pond_id={PondId}/></div>
            </div>
        </div>
        <div className="container">
        <div className="row">       
            <WaterList pondId={PondId}/>
            <WaterDetailsModal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            selectedWater={selectedWater}
            waterDetails={waterDetails}
            updatedDetails={updatedDetails}
            isEditMode={isEditMode}
            setIsEditMode={setIsEditMode}
            handleInputChange={handleInputChange}
            handleSave={handleSave}
            closeModal={closeModal}
            />
        </div>
        </div> 
    </div>
)

}
export default WaterPage;