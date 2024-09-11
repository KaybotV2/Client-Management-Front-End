import React from 'react';
import { InputFieldProps } from '../types';


const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  required = true,
  type = 'text'
}) => (
  <div>
    <label>{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      aria-label={label}
    />
  </div>
);

export default InputField;
