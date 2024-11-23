import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { LoanProvider } from './app/contexts/loanContext';
import { ClientProvider } from './app/contexts/clientContext';
import MainNavigator from './app/navigation/MainNavigator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <LoanProvider>
        <ClientProvider>
          <MainNavigator />
        </ClientProvider>
      </LoanProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
