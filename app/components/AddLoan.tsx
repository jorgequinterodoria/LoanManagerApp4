import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Loan } from '../types/Loan';
import { saveLoan } from '../services/LoanService';
import moment from 'moment';

interface AddLoanProps {
    navigation: any;
}

const AddLoan: React.FC<AddLoanProps> = ({ navigation }) => {
    const [clientId, setClientId] = useState<string>('');
    const [amount, setAmount] = useState<number>(0);
    const [interestRate, setInterestRate] = useState<number>(0);
    const [paymentFrequency, setPaymentFrequency] = useState<string>('monthly');
    const [paymentDate, setPaymentDate] = useState<string>(moment().format('YYYY-MM-DD'));
    const [paymentAmount, setPaymentAmount] = useState<number>(0);
    const [type, setType] = useState<string>('interestOnly');
    const [notes, setNotes] = useState<string>('');

    const handleAddLoan = async () => {
        const newLoan: Loan = {
            id: Math.random().toString(),
            clientId,
            amount,
            interestRate,
            paymentFrequency,
            paymentDate: new Date(paymentDate),
            paymentAmount,
            type,
            status: 'active',
            notes,
        };

        await saveLoan(newLoan);
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Préstamo</Text>
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
            <Button title="Agregar Préstamo" onPress={handleAddLoan} />
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

export default AddLoan;
