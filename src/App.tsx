import React, { useState, useCallback, useEffect } from 'react';
import ClientList from './components/ClientList';
import AddClientForm from './components/AddClientForm';
import UpdateClientForm from './components/UpdateClientForm';
import DeleteClientButton from './components/DeleteClientButton';
import { getClients } from "./api";

const App: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleRefresh = useCallback(() => {
    setSelectedClientId(null); 
    getClients(); // Refresh the client list after an update or delete
  }, [getClients]);

  useEffect(() => {
    getClients(); // Fetch clients on initial load
  }, [getClients]);

  return (
    <div className="App">
      <h1>Client Management</h1>
      <AddClientForm />
      {selectedClientId && (
        <UpdateClientForm clientId={selectedClientId} onSuccess={handleRefresh}/>
      )}
      <ClientList onSelectClient={setSelectedClientId} />
      {selectedClientId && (
        <DeleteClientButton clientId={selectedClientId} onSuccess={handleRefresh} />
      )}
    </div>
  );
};

export default App;
