import { Client } from './types';



const API_BASE_URL = 'http://localhost:3000/clients'; 

const handleResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
    const data = await response.json();
    return data;
  };
  

export const getClients = async (): Promise<Client[]> => {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(client),
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Failed to create client:', error);
      throw error;
    }
  };
  

// Update an existing client by ID
export const updateClient = async (id: string, updatedClient: Omit<Client, 'id'>): Promise<Client> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedClient),
    });
    return handleResponse(response);
  };
  
  // Delete a client by ID
  export const deleteClient = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Something went wrong');
    }
  };
