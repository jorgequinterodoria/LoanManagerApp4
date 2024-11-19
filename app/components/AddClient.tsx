import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Client } from '../types/Client';

interface AddClientProps {
    navigation: any;
}

const AddClient: React.FC<AddClientProps> = ({ navigation }) => {
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');

    const handleAddClient = async () => {
        const clients = await AsyncStorage.getItem('@LoanManagerApp:clients');
        const clientList: Client[] = clients ? JSON.parse(clients) : [];
        const newClient: Client = {
            id: Math.random().toString(),
            name,
            phone,
            email,
        };

        clientList.push(newClient);
        await AsyncStorage.setItem('@LoanManagerApp:clients', JSON.stringify(clientList));
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Agregar Cliente</Text>
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
            <Button title="Agregar Cliente" onPress={handleAddClient} />
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

export default AddClient;
