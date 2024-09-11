import React, { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import ClientList from './components/ClientList';
import AddClientForm from './components/AddClientForm';
import UpdateClientForm from './components/UpdateClientForm';
import { getClients } from './api';

const App: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const location = useLocation(); // Use useLocation to get the current URL

  const handleRefresh = useCallback(() => {
    setSelectedClientId(null); 
    getClients(); // Refresh the client list after an update or delete
    setSuccessMessage('Client operation successful!'); // Set success message
    setTimeout(() => setSuccessMessage(null), 3000); // Clear message after 3 seconds
  }, []);

  useEffect(() => {
    getClients(); // Fetch clients on initial load
  }, []);

  return (
    <div>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<AddClientForm />} />
          <Route path="/clients" element={<ClientList onSelectClient={setSelectedClientId} />} />
        </Routes>
        {/* Only show UpdateClientForm if the path is not "/" */}
        {selectedClientId && location.pathname !== '/' && (
          <UpdateClientForm clientId={selectedClientId} onSuccess={handleRefresh} />
        )}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

const AppWithRouter: React.FC = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
