import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase, getDatabase } from '../services/SQLiteService';

// Definir el tipo de contexto
interface ClientContextType {
  clients: any[];
  loading: boolean;
  addClient: (client: any) => Promise<void>;
  editClient: (client: any) => Promise<void>;
  deleteClient: (id: number) => Promise<void>;
  fetchClients: () => Promise<void>;
}

// Crear el contexto
const ClientContext = createContext<ClientContextType | null>(null);

// Crear el proveedor del contexto
export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    const db = await getDatabase();
    const result = await db.executeSql('SELECT * FROM clients');
    setClients(result[0].rows._array);
    setLoading(false);
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const addClient = async (client: any) => {
    const db = await getDatabase();
    await db.executeSql('INSERT INTO clients (name, phone) VALUES (?, ?)', [client.name, client.phone]);
    await fetchClients(); // Refrescar los datos después de agregar
    console.log('Clients after add:', clients);
  };

  const editClient = async (client: any) => {
    const db = await getDatabase();
    await db.executeSql('UPDATE clients SET name = ?, phone = ? WHERE id = ?', [client.name, client.phone, client.id]);
    await fetchClients(); // Refrescar los datos después de editar
    console.log('Clients after edit:', clients);
  };

  const deleteClient = async (id: number) => {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM clients WHERE id = ?', [id]);
    await fetchClients(); // Refrescar los datos después de eliminar
    console.log('Clients after delete:', clients);
  };

  return (
    <ClientContext.Provider value={{ clients, loading, addClient, editClient, deleteClient, fetchClients }}>
      {children}
    </ClientContext.Provider>
  );
};

// Crear el hook para usar el contexto
export const useClient = () => {
  const context = useContext(ClientContext);
  if (context === null) {
    throw new Error('useClient must be used within a ClientProvider');
  }
  return context;
};
