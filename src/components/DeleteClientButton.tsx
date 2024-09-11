import React, { useState } from 'react';
import { deleteClient } from '../api';
import { DeleteClientButtonProps } from '../types';


const DeleteClientButton: React.FC<DeleteClientButtonProps> = ({ clientId, onSuccess }) => {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteClient(clientId);
      onSuccess(); // Callback to refresh the list after successful deletion
    } catch (err) {
      setError(`Failed to delete client: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  return (
    <div>
      <button onClick={handleDelete}>Delete Client</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DeleteClientButton;
