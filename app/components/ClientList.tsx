import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '../types/Client';

export interface ClientListProps {
    navigation: any;
}

export default function ClientList({ navigation }: ClientListProps) {
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const fetchClients = async () => {
            const clients = await AsyncStorage.getItem('@LoanManagerApp:clients');
            if (clients) {
                setClients(JSON.parse(clients));
            }
        };

        fetchClients();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Clientes</Text>
            <FlatList
                data={clients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.clientCard}>
                        <Text style={styles.clientName}>{item.name}</Text>
                        <Text>Teléfono: {item.phone}</Text>
                        <Text>Correo Electrónico: {item.email}</Text>
                        <Button
                            title="Editar Cliente"
                            onPress={() => navigation.navigate('EditClient', { clientId: item.id })}
                        />
                    </View>
                )}
            />
            <Button
                title="Agregar Cliente"
                onPress={() => navigation.navigate('AddClient')}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
    },
    clientCard: {
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
    clientName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
