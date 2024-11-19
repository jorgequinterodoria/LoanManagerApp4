import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import LoanList from '../components/LoanList';

export default function LoanScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Préstamos</Text>
            <Button
                title="Agregar Préstamo"
                onPress={() => navigation.navigate('AddLoan')}
            />
            <LoanList navigation={navigation} />
        </View>
    );
}

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
    },
});
