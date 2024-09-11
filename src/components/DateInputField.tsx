import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateInputFieldProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
}

const DateInputField: React.FC<DateInputFieldProps> = ({ selectedDate, onDateChange }) => (
  <div>
    <label htmlFor="date_of_birth">Date of Birth</label>
    <DatePicker
      selected={selectedDate}
      onChange={onDateChange}
      dateFormat="yyyy-MM-dd"
      maxDate={new Date()} // Prevent future dates
      showYearDropdown
      scrollableYearDropdown
      placeholderText="Select your date of birth"
      aria-label="Date of Birth"
    />
  </div>
);

export default DateInputField;
