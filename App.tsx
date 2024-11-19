import React from 'react';
import { StyleSheet, SafeAreaView, View } from 'react-native';
import MainNavigator from './app/navigation/MainNavigator';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <MainNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
