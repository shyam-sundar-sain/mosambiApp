import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import {LogoutNavigator} from './StackNavigator';
import SplashScreen from '../screen/SplashScreen';
import {AuthContext} from '../provider/Context';

const MainRoute = () => {
  const [mainRoute, setMainRoute] = useState('SplashScreen');
  const [homeData, setHomeData] = useState({});
  const Stack = createNativeStackNavigator();
  return (
    <AuthContext.Provider
      value={{mainRoute, setMainRoute, homeData, setHomeData}}>
      <Stack.Navigator
        initialRouteName="SplashScreen"
        screenOptions={{headerShown: false}}>
        {mainRoute === 'SplashScreen' ? (
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
        ) : mainRoute === 'LogoutStack' ? (
          <Stack.Screen name="LogoutStack" component={LogoutNavigator} />
        ) : (
          <Stack.Screen name="LoginStack" component={DrawerNavigator} />
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default MainRoute;

const styles = StyleSheet.create({});
