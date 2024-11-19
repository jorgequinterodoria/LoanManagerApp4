import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import ClientList from '../components/ClientList';

export default function ClientScreen({ navigation }: any) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clientes</Text>
            <Button
                title="Agregar Cliente"
                onPress={() => navigation.navigate('AddClient')}
            />
            <ClientList navigation={navigation} />
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
        textAlign: 'center',
    },
});
