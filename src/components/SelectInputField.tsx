import React from 'react';
import { SelectInputFieldProps } from '../types';

const SelectInputField: React.FC<SelectInputFieldProps> = ({
    label,
    name,
    value,
    onChange,
    options,
    required = false
  }) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedValue = e.target.value;
      // Pass the value to the parent component's onChange handler
      onChange(selectedValue);
    };
  
    return (
      <div>
        <label htmlFor={name}>{label}</label>
        <select
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          required={required}
        >
          <option value="">Select {label}</option>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
  
  export default SelectInputField;
