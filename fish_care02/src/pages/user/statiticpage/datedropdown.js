import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
    return (
        <div className="date-picker-container">
            <label>
                Start Date:
                <DatePicker
                    selected={startDate}
                    onChange={(date) => onStartDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    className="date-picker"
                />
            </label>
            <label>
                End Date:
                <DatePicker
                    selected={endDate}
                    onChange={(date) => onEndDateChange(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="yyyy-MM-dd HH:mm:ss"
                    className="date-picker"
                />
            </label>
        </div>
    );
};

export default DateRangePicker;