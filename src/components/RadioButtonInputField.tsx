import React from 'react';
import { RadioButtonInputFieldProps } from '../types';

const RadioButtonInputField: React.FC<RadioButtonInputFieldProps> = ({ 
    label, 
    name, 
    value, 
    onChange, 
    options, 
    required = false 
}) => {
    return (
        <div>
            <label>{label}</label>
            {options.map(option => (
                <div key={option.value}>
                    <input 
                        type="radio" 
                        id={`${name}_${option.value}`} 
                        name={name} 
                        value={option.value} 
                        checked={value === option.value} 
                        onChange={() => onChange(option.value)} 
                        required={required}
                    />
                    <label htmlFor={`${name}_${option.value}`}>{option.label}</label>
                </div>
            ))}
        </div>
    );
}

export default RadioButtonInputField;
