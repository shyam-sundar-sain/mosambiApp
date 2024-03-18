import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './src/routes/StackNavigator';

import setupNotifications from './src/firebase/setupNotifications';
import DrawerLayout from './src/routes/DrawerLayout';
import DrawerNavigator from './src/routes/DrawerNavigator';
import MainRoute from './src/routes/MainRoute';

const App = () => {
  useEffect(() => {
    setupNotifications();
  }, []);

  return (
    <SafeAreaProvider style={styles.container}>
      <NavigationContainer>
        <MainRoute />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
