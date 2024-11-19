import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '../types/Client';

interface EditClientProps {
    navigation: any;
    route: any;
}

const EditClient: React.FC<EditClientProps> = ({ navigation, route }) => {
    const { clientId } = route.params;
    const [client, setClient] = useState<Client | null>(null);

    useEffect(() => {
        const fetchClient = async () => {
            const clients = await AsyncStorage.getItem('@LoanManagerApp:clients');
            const clientList: Client[] = clients ? JSON.parse(clients) : [];
            const foundClient = clientList.find((client) => client.id === clientId);
            if (foundClient) {
                setClient(foundClient);
            }
        };

        fetchClient();
    }, [clientId]);

    const [name, setName] = useState<string>(client ? client.name : '');
    const [phone, setPhone] = useState<string>(client ? client.phone : '');
    const [email, setEmail] = useState<string>(client ? client.email : '');

    const handleSaveClient = async () => {
        if (client) {
            const clients = await AsyncStorage.getItem('@LoanManagerApp:clients');
            const clientList: Client[] = clients ? JSON.parse(clients) : [];
            const updatedClientList = clientList.map((c) =>
                c.id === client.id ? { id: client.id, name, phone, email } : c
            );
            await AsyncStorage.setItem('@LoanManagerApp:clients', JSON.stringify(updatedClientList));
            navigation.goBack();
        }
    };

    if (!client) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Cargando...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Editar Cliente</Text>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
            />
            <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <Button title="Guardar Cliente" onPress={handleSaveClient} />
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
});

export default EditClient;
