export interface Loan {
    id: string;
    clientId: string;
    amount: number;
    interestRate: number;
    paymentFrequency: string;
    paymentDate: Date;
    paymentAmount: number;
    type: 'interestOnly' | 'fixed';
    status: 'active' | 'completed';
    notes: string;
  }
