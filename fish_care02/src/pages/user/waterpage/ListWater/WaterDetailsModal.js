// WaterDetailsModal.js
import React from 'react';
import Modal from 'react-modal';

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
    temperature: { min: 5, max: 26 },
    pH: { min: 6.9, max: 8 },
    salt: { min: 0, max: 0.1 },
    carbonHardnessKH: { min: 4, max: 12 },
    totalChlorine: { min: 0, max: 0.001 },
    co2: { min: 5, max: 35 }
};
const calculateOutOfRange = (paramName, value) => {
    const range = optimalRanges[paramName];
    if (!range) return null;
    
    if (value < range.min) {
        return { status: "below", difference: range.min - value };
    } else if (value > range.max) {
        return { status: "above", difference: value - range.max };
    }
    return { status: "in range", difference: 0 };
};
const WaterDetailsModal = ({
    isOpen,
    onRequestClose,
    selectedWater,
    waterDetails,
    updatedDetails,
    isEditMode,
    setIsEditMode,
    handleInputChange,
    handleSave,
    closeModal,
    getBorderColorForWaterCard,
    openModal
}) => (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="Water Details Modal"
        className="water-details-modal"
    >
      {selectedWater && waterDetails ? (
    <div>
        <h2>{selectedWater.date_time}</h2>
        <form>
            <table className="water-details-table">
                <thead>
                    <tr>
                        <th>Parameter</th>
                        <th>Value</th>
                        <th>Range Optimal</th>
                        <th>Out of Range</th>
                    </tr>
                </thead>
                <tbody>
                {Object.entries(borderColorFunctions).map(([param, getBorderColor], index) => {
                const value = updatedDetails[param] || 0;
                const { min, max } = optimalRanges[param] || {};
                const isInRange = min !== undefined && max !== undefined && value >= min && value <= max;
                const outOfRangeInfo = min !== undefined && max !== undefined
                ? value < min
                    ? `Below by ${(min - value).toFixed(2)}`
                    : value > max
                    ? `Above by ${(value - max).toFixed(2)}`
                    : "In Range"
                : "N/A";
    
                return (
                    <tr key={index}>
                        <td><label>{param.charAt(0).toUpperCase() + param.slice(1)}:</label></td>
                        <td>
                            <input
                                type="text"
                                name={param}
                                value={updatedDetails[param] !== undefined ? updatedDetails[param] : ''}
                                onChange={handleInputChange}
                                readOnly={!isEditMode}
                                style={{
                                    borderColor: getBorderColor(value),
                                    color: getBorderColor(value),
                                }}
                            />
                        </td>
                        <td>
                            {min !== undefined && max !== undefined ? (
                                `${min} - ${max}`
                            ) : (
                                'N/A'
                            )}
                        </td>
                        <td style={{ color: outOfRangeInfo.includes("Above") || outOfRangeInfo.includes("Below") ? "red" : "green" }}>
                            {outOfRangeInfo}
                        </td>
                    </tr>
                );
            })}
                </tbody>
            </table>
            <div className="button-group">
                {!isEditMode ? (
                    <button type="button" onClick={() => setIsEditMode(true)}>Edit</button>
                ) : (
                    <>
                        <button type="button" onClick={handleSave}>Save</button>
                        <button type="button" onClick={() => setIsEditMode(false)}>Cancel</button>
                    </>
                )}
                <button type="button" onClick={closeModal}>Close</button>
            </div>
        </form>
    </div>
            ) : (
    <p>Loading water details...</p>
            )}
            </Modal>
        );

export default WaterDetailsModal;