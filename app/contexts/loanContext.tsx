import React, { createContext, useContext, useState, useEffect } from 'react';
import { initDatabase, getDatabase } from '../services/SQLiteService';

// Define a more specific type for the loan
interface Loan {
  id?: number;
  clientId: number;
  amount: number;
  interestRate: number;
  paymentFrequency: string;
  loanType: string;
  startDate: string;
  endDate: string;
}

// Define the context type
interface LoanContextType {
  loans: Loan[];
  loading: boolean;
  addLoan: (loan: Omit<Loan, 'id'>) => Promise<void>;
  editLoan: (loan: Loan) => Promise<void>;
  deleteLoan: (id: number) => Promise<void>;
}

// Create the context
const LoanContext = createContext<LoanContextType | undefined>(undefined);

// Create the context provider
export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        const db = await getDatabase();
        const result = await db.executeSql('SELECT * FROM loans');
        setLoans(result[0].rows._array);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const addLoan = async (loan: Omit<Loan, 'id'>) => {
    try {
      const db = await getDatabase();
      const result = await db.executeSql(
        'INSERT INTO loans (client_id, amount, interest_rate, payment_frequency, loan_type, start_date, end_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          loan.clientId,
          loan.amount,
          loan.interestRate,
          loan.paymentFrequency,
          loan.loanType,
          loan.startDate,
          loan.endDate
        ]
      );

      // Assuming the database returns the new loan ID
      const newLoan = { ...loan, id: result[0].insertId };
      setLoans(prevLoans => [...prevLoans, newLoan]);
    } catch (error) {
      console.error('Error adding loan:', error);
    }
  };

  const editLoan = async (loan: Loan) => {
    try {
      const db = await getDatabase();
      await db.executeSql(
        'UPDATE loans SET client_id = ?, amount = ?, interest_rate = ?, payment_frequency = ?, loan_type = ?, start_date = ?, end_date = ? WHERE id = ?',
        [
          loan.clientId,
          loan.amount,
          loan.interestRate,
          loan.paymentFrequency,
          loan.loanType,
          loan.startDate,
          loan.endDate,
          loan.id
        ]
      );
      setLoans(prevLoans => prevLoans.map(l => l.id === loan.id ? loan : l));
    } catch (error) {
      console.error('Error editing loan:', error);
    }
  };

  const deleteLoan = async (id: number) => {
    try {
      const db = await getDatabase();
      await db.executeSql('DELETE FROM loans WHERE id = ?', [id]);
      setLoans(prevLoans => prevLoans.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  return (
    <LoanContext.Provider value={{ loans, loading, addLoan, editLoan, deleteLoan }}>
      {children}
    </LoanContext.Provider>
  );
};

// Create a custom hook to use the context
export const useLoan = () => {
  const context = useContext(LoanContext);
  if (context === undefined) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
};
