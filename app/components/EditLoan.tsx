import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Loan } from '../types/Loan';
import { getLoans, saveLoan } from '../services/LoanService';
import moment from 'moment';

interface EditLoanProps {
    navigation: any;
    route: any;
}

const EditLoan: React.FC<EditLoanProps> = ({ navigation, route }) => {
    const { loanId } = route.params;
    const [loan, setLoan] = useState<Loan | null>(null);

    useEffect(() => {
        const fetchLoan = async () => {
            const loans = await getLoans();
            const foundLoan = loans.find((loan) => loan.id === loanId);
            if (foundLoan) {
                setLoan(foundLoan);
            }
        };

        fetchLoan();
    }, [loanId]);

    const [clientId, setClientId] = useState<string>(loan ? loan.clientId : '');
    const [amount, setAmount] = useState<number>(loan ? loan.amount : 0);
    const [interestRate, setInterestRate] = useState<number>(loan ? loan.interestRate : 0);
    const [paymentFrequency, setPaymentFrequency] = useState<string>(loan ? loan.paymentFrequency : 'monthly');
    const [paymentDate, setPaymentDate] = useState<string>(loan ? moment(loan.paymentDate).format('YYYY-MM-DD') : '');
    const [paymentAmount, setPaymentAmount] = useState<number>(loan ? loan.paymentAmount : 0);
    const [type, setType] = useState<string>(loan ? loan.type : 'interestOnly');
    const [notes, setNotes] = useState<string>(loan ? loan.notes : '');

    const handleSaveLoan = async () => {
        if (loan) {
            const updatedLoan: Loan = {
                ...loan,
                clientId,
                amount,
                interestRate,
                paymentFrequency,
                paymentDate: new Date(paymentDate),
                paymentAmount,
                type,
                notes,
            };

            const loans = await getLoans();
            const updatedLoans = loans.map((l) => (l.id === loan.id ? updatedLoan : l));
            await AsyncStorage.setItem('@LoanManagerApp:loans', JSON.stringify(updatedLoans));
            navigation.goBack();
        }
    };

    if (!loan) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Préstamo</Text>
            <TextInput
                style={styles.input}
                placeholder="ID del Cliente"
                value={clientId}
                onChangeText={setClientId}
            />
            <TextInput
                style={styles.input}
                placeholder="Monto"
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(value) => setAmount(parseFloat(value))}
            />
            <TextInput
                style={styles.input}
                placeholder="Tasa de Interés (%)"
                keyboardType="numeric"
                value={interestRate.toString()}
                onChangeText={(value) => setInterestRate(parseFloat(value))}
            />
            <Picker
                selectedValue={paymentFrequency}
                style={styles.picker}
                onValueChange={(itemValue) => setPaymentFrequency(itemValue)}
            >
                <Picker.Item label="Mensual" value="monthly" />
                <Picker.Item label="Semanal" value="weekly" />
                <Picker.Item label="Quincenal" value="biweekly" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Fecha de Pago (YYYY-MM-DD)"
                value={paymentDate}
                onChangeText={setPaymentDate}
            />
            <TextInput
                style={styles.input}
                placeholder="Monto de Pago"
                keyboardType="numeric"
                value={paymentAmount.toString()}
                onChangeText={(value) => setPaymentAmount(parseFloat(value))}
            />
            <Picker
                selectedValue={type}
                style={styles.picker}
                onValueChange={(itemValue) => setType(itemValue)}
            >
                <Picker.Item label="Solo Intereses" value="interestOnly" />
                <Picker.Item label="Fijo (Intereses + Capital)" value="fixed" />
            </Picker>
            <TextInput
                style={styles.input}
                placeholder="Notas"
                value={notes}
                onChangeText={setNotes}
            />
            <Button title="Guardar Préstamo" onPress={handleSaveLoan} />
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
});

export default EditLoan;
