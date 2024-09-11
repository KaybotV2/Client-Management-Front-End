import React, { useEffect, useState } from 'react';
import { getClients } from '../api';
import { Client, ClientListProps } from '../types';
import { fundingSourceMapping } from '../FundingSourceMapping';

const fundingSourceLabels = Object.entries(fundingSourceMapping).reduce((acc, [label, value]) => {
  acc[value] = label;
  return acc;
}, {} as { [key: number]: string });

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
        console.error('Error fetching clients:', err);
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
    <div className="client-list-container">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Main Language</th>
            <th>Secondary Language</th>
            <th>Funding Source</th>
          </tr>
        </thead>
        <tbody>
          {clients.map(client => {
            const formattedDate = client.date_of_birth
              ? new Date(client.date_of_birth).toLocaleDateString()
              : 'Date not available';

            const fundingSourceLabel = fundingSourceLabels[client.funding_source_id] || 'Unknown';

            return (
              <tr key={client.id} onClick={() => onSelectClient(client.id)} style={{ cursor: 'pointer' }}>
                <td>{client.name}</td>
                <td>{formattedDate}</td>
                <td>{client.main_language}</td>
                <td>{client.secondary_language || 'None'}</td>
                <td>{fundingSourceLabel}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientList;
