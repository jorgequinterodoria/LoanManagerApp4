import React, { createContext, useContext, useState, useEffect } from 'react';
import { getDatabase } from '../services/SQLiteService';

// Define a specific interface for Client
interface Client {
  id?: number;
  name: string;
  phone: string;
}

// Define the context type
interface ClientContextType {
  clients: Client[];
  loading: boolean;
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  editClient: (client: Client) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
}

// Create the context
const ClientContext = createContext<ClientContextType | undefined>(undefined);

// Create the context provider
export const ClientProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const db = await getDatabase();
        const result = await db.executeSql('SELECT * FROM clients');

        // Safely extract rows
        const fetchedClients: Client[] = [];
        for (let i = 0; i < result[0].rows.length; i++) {
          fetchedClients.push(result[0].rows.item(i));
        }

        setClients(fetchedClients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  const addClient = async (client: Omit<Client, 'id'>) => {
    try {
      const db = await getDatabase();
      const result = await db.executeSql(
        'INSERT INTO clients (name, phone) VALUES (?, ?)',
        [client.name, client.phone]
      );

      // Add the new client with the inserted ID
      const newClient = { ...client, id: result[0].insertId };
      setClients(prevClients => [...prevClients, newClient]);
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const editClient = async (client: Client) => {
    try {
      const db = await getDatabase();
      await db.executeSql(
        'UPDATE clients SET name = ?, phone = ? WHERE id = ?',
        [client.name, client.phone, client.id]
      );
      setClients(prevClients =>
        prevClients.map(c => c.id === client.id ? client : c)
      );
    } catch (error) {
      console.error('Error editing client:', error);
      throw error;
    }
  };

  const deleteClient = async (id: number) => {
    try {
      const db = await getDatabase();
      await db.executeSql('DELETE FROM clients WHERE id = ?', [id]);
      setClients(prevClients => prevClients.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  return (
    <ClientContext.Provider value={{ clients, loading, addClient, editClient, deleteClient }}>
      {children}
    </ClientContext.Provider>
  );
};

// Create a custom hook to use the context
export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
