import React, { useState, useCallback } from 'react';
import { createClient } from '../api';
import { Client } from '../types';
import InputField from './InputField';
import DateInputField from './DateInputField';
import SelectInputField from './SelectInputField';
import RadioButtonInputField from './RadioButtonInputField';
import { LANGUAGES } from '../enums';
import { fundingSourceMapping } from '../FundingSourceMapping';

const AddClientForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        date_of_birth: null as Date | null,
        main_language: '',
        secondary_language: '',
        funding_source_id: null as number | null
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const fundingSources = Object.keys(fundingSourceMapping).map(source => ({
        value: fundingSourceMapping[source],
        label: source
    }));

    const handleDateChange = (date: Date | null) => {
        setFormData(prev => ({ ...prev, date_of_birth: date }));
    };

    const handleSelectInputChange = (name: string, value: string ) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioInputChange = (name: string, value: number) => {
        setFormData({ ...formData, [name]: value });
    };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.date_of_birth) {
      setError('Date of birth is required');
      return;
    }

    try {
      const newClient: Omit<Client, 'id'> = { 
        name: formData.name, 
        date_of_birth: formData.date_of_birth, 
        main_language: formData.main_language, 
        secondary_language: formData.secondary_language, 
        funding_source_id: formData.funding_source_id as number
      };
      await createClient(newClient);
      setSuccess('Client added successfully!');
      resetForm();
    } catch (err) {
      setError(`Failed to add client: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      date_of_birth: null,
      main_language: '',
      secondary_language: '',
      funding_source_id: null
    });
  }, []);

  return (
    <div>
      <h2>Add Client</h2>
      <form onSubmit={handleSubmit} noValidate>
        <InputField 
          label="Name" 
          value={formData.name} 
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))} 
        />
        <DateInputField 
          selectedDate={formData.date_of_birth} 
          onDateChange={handleDateChange} 
        />
        <SelectInputField
          label="Main Language"
          name="main_language"
          value={formData.main_language}
          onChange={(value) => handleSelectInputChange('main_language', value)}
          options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
          required
        />
        <SelectInputField
          label="Secondary Language"
          name="secondary_language"
          value={formData.secondary_language}
          onChange={(value) => handleSelectInputChange('secondary_language', value)}
          options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
        />
        <RadioButtonInputField
            label="Funding Source"
            name="funding_source_id"
            value={Number(formData.funding_source_id)}
            onChange={(value) => handleRadioInputChange('funding_source_id', value)}
            options={fundingSources}
            required
        />
        <button type="submit">Add Client</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default AddClientForm;
