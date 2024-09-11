import React, { useState, useEffect, useCallback } from 'react';
import { updateClient } from '../api';
import { Client, UpdateClientFormProps } from '../types';
import InputField from './InputField';
import DateInputField from './DateInputField';
import SelectInputField from './SelectInputField';
import RadioButtonInputField from './RadioButtonInputField';
import { LANGUAGES } from '../enums';
import { fundingSourceMapping } from '../FundingSourceMapping';

const UpdateClientForm: React.FC<UpdateClientFormProps> = ({ clientId, onSuccess }) => {
  const [clientData, setClientData] = useState<Omit<Client, 'id'> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/clients/${clientId}`);
        const data = await response.json();
        setClientData({
          name: data.name,
          date_of_birth: new Date(data.date_of_birth),
          main_language: data.main_language,
          secondary_language: data.secondary_language,
          funding_source_id: data.funding_source_id
        });
      } catch (err) {
        console.error('Error fetching client data:', err);
        setError('Failed to fetch client data');
      }
    };

    fetchClientData();
  }, [clientId]);

  const handleDateChange = (date: Date | null) => {
    setClientData(prev => prev ? { ...prev, date_of_birth: date } : null);
  };

  const handleChange = (name: string, value: string | number ) => {
    setClientData(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!clientData || !clientData.date_of_birth) {
      setError('Date of birth is required');
      return;
    }

    try {
      await updateClient(clientId, clientData);
      setSuccess('Client updated successfully!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(`Failed to update client: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (!clientData) return <p>Loading client data...</p>;

   // Map funding sources to appropriate structure
   const fundingSources = Object.keys(fundingSourceMapping).map(source => ({
    value: fundingSourceMapping[source],
    label: source
  }));

  return (
    <div>
      <h2>Update Client</h2>
      <form onSubmit={handleSubmit} noValidate>
        <InputField
          label="Name"
          value={clientData.name}
          onChange={(value) => handleChange('name', value)}
        />
        <DateInputField
          selectedDate={clientData.date_of_birth}
          onDateChange={handleDateChange}
        />
        <SelectInputField
          label="Main Language"
          name="main_language"
          value={clientData.main_language}
          onChange={(value) => handleChange('main_language', value)}
          options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
          required
        />
        <SelectInputField
          label="Secondary Language"
          name="secondary_language"
          value={clientData.secondary_language}
          onChange={(value) => handleChange('secondary_language', value)}
          options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
        />
        <RadioButtonInputField
            label="Funding Source"
            name="funding_source_id"
            value={clientData.funding_source_id}
            onChange={(value) => handleChange('funding_source_id', value)}
            options={fundingSources}
            required
        />
        <button type="submit">Update Client</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
};

export default UpdateClientForm;
