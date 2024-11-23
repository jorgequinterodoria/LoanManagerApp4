import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase, getDatabase } from '../services/SQLiteService';

// Definir el tipo de contexto
interface LoanContextType {
  loans: any[];
  loading: boolean;
  addLoan: (loan: any) => Promise<void>;
  editLoan: (loan: any) => Promise<void>;
  deleteLoan: (id: number) => Promise<void>;
}

// Crear el contexto
const LoanContext = createContext<LoanContextType | null>(null);

// Crear el proveedor del contexto
export const LoanProvider = ({ children }: { children: React.ReactNode }) => {
  const [loans, setLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      const db = await getDatabase();
      const result = await db.executeSql('SELECT * FROM loans');
      setLoans(result[0].rows._array);
      setLoading(false);
    };
    fetchLoans();
  }, []);

  const addLoan = async (loan: any) => {
    const db = await getDatabase();
    await db.executeSql('INSERT INTO loans (client_id, amount, interest_rate, payment_frequency, loan_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)', [
      loan.clientId, loan.amount, loan.interestRate, loan.paymentFrequency, loan.loanType, loan.startDate, loan.endDate
    ]);
    setLoans([...loans, loan]);
  };

  const editLoan = async (loan: any) => {
    const db = await getDatabase();
    await db.executeSql('UPDATE loans SET client_id = ?, amount = ?, interest_rate = ?, payment_frequency = ?, loan_type = ?, start_date = ?, end_date = ? WHERE id = ?', [
      loan.clientId, loan.amount, loan.interestRate, loan.paymentFrequency, loan.loanType, loan.startDate, loan.endDate, loan.id
    ]);
    setLoans(loans.map(l => l.id === loan.id ? loan : l));
  };

  const deleteLoan = async (id: number) => {
    const db = await getDatabase();
    await db.executeSql('DELETE FROM loans WHERE id = ?', [id]);
    setLoans(loans.filter(l => l.id !== id));
  };

  return (
    <LoanContext.Provider value={{ loans, loading, addLoan, editLoan, deleteLoan }}>
      {children}
    </LoanContext.Provider>
  );
};

// Crear el hook para usar el contexto
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === null) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};
