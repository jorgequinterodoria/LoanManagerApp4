import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Loan } from '../types/Loan';
import { getLoans, saveLoan } from '../services/LoanService';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PaymentScreenProps {
    navigation: any;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
    const [loans, setLoans] = useState<Loan[]>([]);
    const [selectedLoanId, setSelectedLoanId] = useState<string>('');
    const [loan, setLoan] = useState<Loan | null>(null);
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [notes, setNotes] = useState<string>('');
    const [receiptImage, setReceiptImage] = useState<string>('');

    useEffect(() => {
        const fetchLoans = async () => {
            const fetchedLoans = await getLoans();
            setLoans(fetchedLoans);
        };

        fetchLoans();
    }, []);

    useEffect(() => {
        if (selectedLoanId) {
            const foundLoan = loans.find((loan) => loan.id === selectedLoanId);
            if (foundLoan) {
                setLoan(foundLoan);
            }
        }
    }, [selectedLoanId, loans]);

    const handleSavePayment = async () => {
        if (loan) {
            let updatedLoan: Loan = { ...loan };

            if (loan.type === 'interestOnly') {
                // Si el pago es mayor al monto de la cuota, restar el excedente al capital
                if (paymentAmount > loan.paymentAmount) {
                    const excess = paymentAmount - loan.paymentAmount;
                    updatedLoan.amount -= excess;
                }
                updatedLoan.paymentAmount -= paymentAmount;
                if (updatedLoan.paymentAmount <= 0) {
                    updatedLoan.status = 'completed';
                }
            } else if (loan.type === 'fixed') {
                updatedLoan.amount -= paymentAmount;
                if (updatedLoan.amount <= 0) {
                    updatedLoan.status = 'completed';
                }
                // Recalcular cuotas restantes
                const remainingPayments = Math.ceil(updatedLoan.amount / updatedLoan.paymentAmount);
                updatedLoan.paymentAmount = remainingPayments > 0 ? updatedLoan.amount / remainingPayments : 0;
            }

            updatedLoan.notes = notes;

            const updatedLoans = loans.map((l) => (l.id === loan.id ? updatedLoan : l));
            await AsyncStorage.setItem('@LoanManagerApp:loans', JSON.stringify(updatedLoans));
            navigation.goBack();
        }
    };

    const handleUploadReceipt = () => {
        // Implementar la lógica para subir una imagen de recibo
        // Por ejemplo, usando una biblioteca como react-native-image-picker
    };

    if (!loans.length) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrar Pago</Text>
            <Picker
                selectedValue={selectedLoanId}
                style={styles.picker}
                onValueChange={(itemValue) => setSelectedLoanId(itemValue)}
            >
                {loans.map((loan) => (
                    <Picker.Item key={loan.id} label={`Préstamo ${loan.id} - ${loan.clientId}`} value={loan.id} />
                ))}
            </Picker>
            {loan && (
                <>
                    <Text>ID del Préstamo: {loan.id}</Text>
                    <Text>ID del Cliente: {loan.clientId}</Text>
                    <Text>Monto: ${loan.amount.toFixed(2)}</Text>
                    <Text>Tasa de Interés: {loan.interestRate}%</Text>
                    <Text>Frecuencia de Pago: {loan.paymentFrequency}</Text>
                    <Text>Fecha de Pago: {moment(loan.paymentDate).format('YYYY-MM-DD')}</Text>
                    <Text>Monto de Pago: ${loan.paymentAmount.toFixed(2)}</Text>
                    <Text>Tipo: {loan.type}</Text>
                    <Text>Estado: {loan.status}</Text>
                    <Text>Notas: {loan.notes}</Text>
                </>
            )}
            <TextInput
                style={styles.input}
                placeholder="Monto del Pago"
                keyboardType="numeric"
                value={paymentAmount.toString()}
                onChangeText={(value) => setPaymentAmount(parseFloat(value))}
            />
            <TextInput
                style={styles.input}
                placeholder="Notas"
                value={notes}
                onChangeText={setNotes}
            />
            {receiptImage && <Image source={{ uri: receiptImage }} style={styles.receiptImage} />}
            <Button title="Subir Recibo" onPress={handleUploadReceipt} />
            <Button title="Guardar Pago" onPress={handleSavePayment} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    picker: {
        height: 50,
        marginBottom: 12,
    },
    receiptImage: {
        width: '100%',
        height: 200,
        marginBottom: 12,
        borderRadius: 8,
    },
});

export default PaymentScreen;
