import React, { useState, useEffect } from 'react';
import { updateClient, deleteClient  } from '../api';
import { useNavigate } from 'react-router-dom'; 
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
  const navigate = useNavigate();

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

  const handleCancel = () => {
    setClientData(null);
    setError(null);
    setSuccess(null);
    alert('Form cancelled');
    navigate('/clients'); 
  };

  const handleDelete = async () => {
    try {
      await deleteClient(clientId); 
      setSuccess('Client deleted');
      navigate('/clients'); 
    } catch (err) {
      setError(`Failed to delete client: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  if (!clientData) return <p>Loading client data...</p>;

   // Map funding sources to appropriate structure
   const fundingSources = Object.keys(fundingSourceMapping).map(source => ({
    value: fundingSourceMapping[source],
    label: source
  }));

  return (
    <div className="update-client-container">
      <div className="update-client-header">
        <h2>Update Client</h2>
      </div>
      <form onSubmit={handleSubmit} noValidate className="update-client-form">
        <div className="form-group">
          <InputField
            label="Name"
            value={clientData.name}
            onChange={(value) => handleChange('name', value)}
          />
        </div>
        <div className="form-group">
          <DateInputField
            selectedDate={clientData.date_of_birth}
            onDateChange={handleDateChange}
          />
        </div>
        <div className="form-group">
          <SelectInputField
            label="Main Language"
            name="main_language"
            value={clientData.main_language}
            onChange={(value) => handleChange('main_language', value)}
            options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
            required
          />
        </div>
        <div className="form-group">
          <SelectInputField
            label="Secondary Language"
            name="secondary_language"
            value={clientData.secondary_language}
            onChange={(value) => handleChange('secondary_language', value)}
            options={LANGUAGES.map(lang => ({ value: lang, label: lang }))}
          />
        </div>
        <div className="form-group">
          <RadioButtonInputField
            label="Funding Source"
            name="funding_source_id"
            value={clientData.funding_source_id}
            onChange={(value) => handleChange('funding_source_id', value)}
            options={fundingSources}
            required
          />
        </div>
        <div className="button-group">
          <button type="submit">Update Client</button>
          <button type="button" onClick={handleCancel}>Cancel</button>
          <button type="button" className="delete-button" onClick={handleDelete}>Delete</button> 
        </div>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default UpdateClientForm;
