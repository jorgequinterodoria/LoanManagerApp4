import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { getLoans } from '../services/LoanService';
import LoanCard from './LoanCard';
import { Loan } from '../types/Loan';

interface LoanListProps {
    navigation: any;
}

export default function LoanList({ navigation }: LoanListProps) {
    const [loans, setLoans] = useState<Loan[]>([]);

    useEffect(() => {
        const fetchLoans = async () => {
            const loans = await getLoans();
            setLoans(loans);
        };

        fetchLoans();
    }, []);

    return (
        <View style={styles.container}>
            <FlatList
                data={loans}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <LoanCard loan={item} navigation={navigation} />}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f9f9f9',
    },
});
