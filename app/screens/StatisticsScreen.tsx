import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useClient } from '../contexts/clientContext';
import { useLoan } from '../contexts/loanContext';
import moment from 'moment';

const StatisticsScreen = () => {
  const { clients, loading: clientsLoading, fetchClients } = useClient();
  const { loans, loading: loansLoading } = useLoan();
  const [totalClients, setTotalClients] = useState(0);
  const [totalActiveCapital, setTotalActiveCapital] = useState(0);
  const [totalInstallments, setTotalInstallments] = useState(0);
  const [totalCollectedThisMonth, setTotalCollectedThisMonth] = useState(0);

  useEffect(() => {
    if (clients && loans) {
      const calculateStatistics = () => {
        const totalClients = clients.length;
        const totalActiveCapital = loans.reduce((acc, loan) => acc + loan.amount, 0);
        const totalInstallments = loans.reduce((acc, loan) => {
          return acc + loan.payments.reduce((acc, payment) => acc + payment.amount, 0);
        }, 0);

        const currentMonth = moment().format('YYYY-MM');
        const totalCollectedThisMonth = loans.reduce((acc, loan) => {
          return acc + loan.payments.reduce((acc, payment) => {
            const paymentMonth = moment(payment.paymentDate).format('YYYY-MM');
            return paymentMonth === currentMonth ? acc + payment.amount : acc;
          }, 0);
        }, 0);

        setTotalClients(totalClients);
        setTotalActiveCapital(totalActiveCapital);
        setTotalInstallments(totalInstallments);
        setTotalCollectedThisMonth(totalCollectedThisMonth);
      };

      calculateStatistics();
    }
  }, [clients, loans]);

  useEffect(() => {
    // Refrescar los datos de clientes al montar el componente
    fetchClients();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de Clientes</Text>
        <Text style={styles.cardValue}>{totalClients}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total de Capital Activo</Text>
        <Text style={styles.cardValue}>{`$${totalActiveCapital.toFixed(2)}`}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Suma de Cuotas de los Préstamos</Text>
        <Text style={styles.cardValue}>{`$${totalInstallments.toFixed(2)}`}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Valor Recaudado en El Mes En Curso</Text>
        <Text style={styles.cardValue}>{`$${totalCollectedThisMonth.toFixed(2)}`}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 16,
  },
});

export default StatisticsScreen;
