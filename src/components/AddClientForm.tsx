import React, { useState, useCallback } from 'react';
import { createClient } from '../api';
import { useNavigate } from 'react-router-dom'; 
import { Client } from '../types';
import InputField from './InputField';
import DateInputField from './DateInputField';
import SelectInputField from './SelectInputField';
import RadioButtonInputField from './RadioButtonInputField';
import { LANGUAGES } from '../enums';
import { fundingSourceMapping } from '../FundingSourceMapping';

const AddClientWizard: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
      name: '',
      date_of_birth: null as Date | null,
      main_language: '',
      secondary_language: '',
      funding_source_id: null as number | null
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const fundingSources = Object.keys(fundingSourceMapping).map(source => ({
      value: fundingSourceMapping[source],
      label: source
  }));

  const handleDateChange = (date: Date | null) => {
      setFormData(prev => ({ ...prev, date_of_birth: date }));
  };

  const handleSelectInputChange = (name: string, value: string) => {
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioInputChange = (name: string, value: number) => {
      setFormData(prev => ({ ...prev, [name]: value }));
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
          navigate('/clients'); 
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

  const handleNextStep = () => {
      if (step < 3) setStep(step + 1);
  };

  const handlePreviousStep = () => {
      if (step > 1) setStep(step - 1);
  };

  return (
      <div className="wizard-container">
          <div className="wizard-header">
              <h1>Add Client</h1>
          </div>
          <form onSubmit={handleSubmit} noValidate className="wizard-form">
              <div className={`wizard-step ${step === 1 ? 'active' : ''}`}>
                <h2>Personal Information</h2>
                  <InputField 
                      label="Name" 
                      value={formData.name} 
                      onChange={(value) => setFormData(prev => ({ ...prev, name: value }))} 
                  />
                  <DateInputField 
                      selectedDate={formData.date_of_birth} 
                      onDateChange={handleDateChange} 
                  />
                  <div className="wizard-buttons">
                      <button type="button" onClick={handleNextStep}>Next</button>
                  </div>
              </div>

              <div className={`wizard-step ${step === 2 ? 'active' : ''}`}>
                <h2>Languages</h2>
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
                  <div className="wizard-buttons">
                      <button type="button" className="previous" onClick={handlePreviousStep}>Previous</button>
                      <button type="button" onClick={handleNextStep}>Next</button>
                  </div>
              </div>

              <div className={`wizard-step ${step === 3 ? 'active' : ''}`}>
                <h2>Funding Source</h2>
                  <RadioButtonInputField
                      label="Funding Source"
                      name="funding_source_id"
                      value={Number(formData.funding_source_id)}
                      onChange={(value) => handleRadioInputChange('funding_source_id', value)}
                      options={fundingSources}
                      required
                  />
                  <div className="wizard-buttons">
                      <button type="button" className="previous" onClick={handlePreviousStep}>Previous</button>
                      <button type="submit">Submit</button>
                  </div>
              </div>

              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
          </form>
      </div>
  );
};

export default AddClientWizard;
