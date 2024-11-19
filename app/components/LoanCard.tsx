import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Loan } from '../types/Loan';
import moment from 'moment';

interface LoanCardProps {
    loan: Loan;
    navigation: any;
}

const LoanCard: React.FC<LoanCardProps> = ({ loan, navigation }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Cliente: {loan.clientId}</Text>
            <Text>Monto: ${loan.amount.toFixed(2)}</Text>
            <Text>Tasa de Interés: {loan.interestRate}%</Text>
            <Text>Frecuencia de Pago: {loan.paymentFrequency}</Text>
            <Text>Fecha de Pago: {moment(loan.paymentDate).format('YYYY-MM-DD')}</Text>
            <Text>Monto de Pago: ${loan.paymentAmount.toFixed(2)}</Text>
            <Text>Tipo: {loan.type}</Text>
            <Text>Estado: {loan.status}</Text>
            <Text>Notas: {loan.notes}</Text>
            <Button
                title="Editar Préstamo"
                onPress={() => navigation.navigate('EditLoan', { loanId: loan.id })}
            />
            <Button
                title="Registrar Pago"
                onPress={() => navigation.navigate('PaymentScreen', { loanId: loan.id })}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoanCard;
