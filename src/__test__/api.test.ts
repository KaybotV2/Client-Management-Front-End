import { getClients, createClient, updateClient, deleteClient } from '../api';
import { Client } from '../types';
import { fundingSourceMapping } from '../FundingSourceMapping'

const mockClient: Client = {
    id: '1',
    name: 'John Doe',
    date_of_birth: new Date('1990-01-01'), 
    main_language: 'English',
    secondary_language: 'Spanish',
    funding_source_id: fundingSourceMapping['NDIS'],
};

// Mock fetch function
const mockFetch = jest.fn();

beforeEach(() => {
  // Clear all instances and calls to constructor and all methods:
  mockFetch.mockClear();
  // Set global fetch to our mock
  (global as any).fetch = mockFetch;
});

describe('API Functions', () => {
    test('getClients should return a list of clients', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockClient],
      });
  
      const clients = await getClients();
      expect(clients).toEqual([mockClient]);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/clients');
    });
  
    test('createClient should return the created client', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      });
  
      const client = await createClient({
        name: 'John Doe',
        date_of_birth: new Date('01-01-1990'),
        main_language: 'English',
        secondary_language: 'Spanish',
        funding_source_id: fundingSourceMapping['NDIS']
      });
      expect(client).toEqual(mockClient);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          date_of_birth: new Date('01-01-1990'),
          main_language: 'English',
          secondary_language: 'Spanish',
          funding_source_id: fundingSourceMapping['NDIS']
        }),
      });
    });
  
    test('updateClient should return the updated client', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockClient,
      });
  
      const client = await updateClient('1', {
        name: 'John Doe',
        date_of_birth: new Date('01-01-1990'),
        main_language: 'English',
        secondary_language: 'Spanish',
        funding_source_id: fundingSourceMapping['NDIS']
      });
      expect(client).toEqual(mockClient);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/clients/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          date_of_birth: new Date('01-01-1990'),
          main_language: 'English',
          secondary_language: 'Spanish',
          funding_source_id: fundingSourceMapping['NDIS']
        }),
      });
    });
  
    test('deleteClient should succeed without returning data', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });
  
      await expect(deleteClient('1')).resolves.toBeUndefined();
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3000/clients/1', {
        method: 'DELETE',
      });
    });
  
    test('handleResponse should throw an error if response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Error occurred' }),
      });
  
      await expect(getClients()).rejects.toThrow('Error occurred');
    });
  });