import React, { useEffect, useState } from 'react';
import { getClients } from '../api';
import { Client } from '../types';

interface ClientListProps {
    onSelectClient: (id: string) => void; // Callback to set the selected client ID
  }

const ClientList: React.FC<ClientListProps> = ({ onSelectClient }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const clientsData = await getClients();
        setClients(clientsData);
      } catch (err) {
        console.error('Error fetching clients:', err); // Log the error
        setError('Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  

  return (
    <ul>
      {clients.map(client => {
        const formattedDate = client.date_of_birth
        ? new Date(client.date_of_birth).toLocaleDateString() // Ensure date is not null
        : 'Date not available'; // Fallback text if date is null
        return (
            <li key={client.id} onClick={() => onSelectClient(client.id)} style={{ cursor: 'pointer' }}>
            {client.id} - {client.name} - {formattedDate} - {client.main_language} - {client.secondary_language} - {client.funding_source_id} 
          </li>
        );
      })}
    </ul>
  );
  
};

export default ClientList;
