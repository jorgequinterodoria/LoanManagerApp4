import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import LoanScreen from '../screens/LoanScreen';
import ClientScreen from '../screens/ClientScreen';
import StatisticsScreen from '../screens/StatisticsScreen';
import PaymentScreen from '../screens/PaymentScreen';
import AddLoan from '../components/AddLoan';
import EditLoan from '../components/EditLoan';
import AddClient from '../components/AddClient';
import EditClient from '../components/EditClient';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LoanStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Loans" component={LoanScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddLoan" component={AddLoan} options={{ title: 'Agregar Préstamo' }} />
      <Stack.Screen name="EditLoan" component={EditLoan} options={{ title: 'Editar Préstamo' }} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} options={{ title: 'Registrar Pago' }} />
    </Stack.Navigator>
  );
}

function ClientStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Clients" component={ClientScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AddClient" component={AddClient} options={{ title: 'Agregar Cliente' }} />
      <Stack.Screen name="EditClient" component={EditClient} options={{ title: 'Editar Cliente' }} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            switch (route.name) {
              case 'Home':
                iconName = 'home-outline';
                break;
              case 'Loans':
                iconName = 'wallet-outline';
                break;
              case 'Clients':
                iconName = 'people-outline';
                break;
              case 'Statistics':
                iconName = 'stats-chart-outline';
                break;
              case 'Payments':
                iconName = 'card-outline';
                break;
              default:
                iconName = 'help-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6347',
          tabBarInactiveTintColor: 'gray',
          tabBarLabel: route.name === 'Home' ? 'Inicio' :
                        route.name === 'Loans' ? 'Préstamos' :
                        route.name === 'Clients' ? 'Clientes' :
                        route.name === 'Statistics' ? 'Estadísticas' :
                        route.name === 'Payments' ? 'Pagos' :
                        'Ayuda',
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Loans" component={LoanStack} />
        <Tab.Screen name="Clients" component={ClientStack} />
        <Tab.Screen name="Statistics" component={StatisticsScreen} />
        <Tab.Screen name="Payments" component={PaymentScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
