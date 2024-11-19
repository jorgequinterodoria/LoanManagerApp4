import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { useClient } from '../contexts/clientContext';
import { useLoan } from '../contexts/loanContext';
import ChartComponent from '../components/ChartComponent';

ChartJS.register(...registerables);

const StatisticsScreen = () => {
  const { loans, loading } = useLoan();
  const { clients } = useClient();
  const [loanData, setLoanData] = useState<any>({});
  const [paymentData, setPaymentData] = useState<any>({});

  useEffect(() => {
    const fetchData = async () => {
      // Fetch and process data for statistics
      const loanAmounts = loans.reduce((acc, loan) => acc + loan.amount, 0);
      const paymentAmounts = loans.reduce((acc, loan) => {
        const payments = loan.payments.reduce((acc, payment) => acc + payment.amount, 0);
        return acc + payments;
      }, 0);

      setLoanData({
        labels: loans.map(loan => loan.startDate),
        datasets: [{
          label: 'Total Loans',
          data: loans.map(loan => loan.amount),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }],
      });

      setPaymentData({
        labels: loans.map(loan => loan.startDate),
        datasets: [{
          label: 'Total Payments',
          data: loans.map(loan => loan.payments.reduce((acc, payment) => acc + payment.amount, 0)),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
        }],
      });
    };

    fetchData();
  }, [loans]);

  return (
    <View style={styles.container}>
      <Text>Statistics</Text>
      <ChartComponent data={loanData} type="bar" />
      <ChartComponent data={paymentData} type="bar" />
      <Text>Total Capital Active: {loanAmounts}</Text>
      <Text>Total Loans Active: {loans.length}</Text>
      <Text>Total Payments: {paymentAmounts}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
});

export default StatisticsScreen;
