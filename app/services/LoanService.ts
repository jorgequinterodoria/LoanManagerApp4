import AsyncStorage from '@react-native-async-storage/async-storage';
import { Loan } from '../types/Loan';

const LOANS_STORAGE_KEY = '@LoanManagerApp:loans';

export async function getLoans(): Promise<Loan[]> {
  try {
    const value = await AsyncStorage.getItem(LOANS_STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function saveLoan(loan: Loan) {
  try {
    const loans = await getLoans();
    const newLoans = [...loans, loan];
    await AsyncStorage.setItem(LOANS_STORAGE_KEY, JSON.stringify(newLoans));
  } catch (e) {
    console.error(e);
  }
}

// Implementar más métodos según sea necesario (editar, eliminar, etc.)
