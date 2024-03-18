import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screen/LoginScreen';
import LoginWithEmail from '../screen/LoginWithEmail';
import LoginWithPassword from '../screen/LoginWithPassword';
import OtpVerification from '../screen/OtpVerification';
import RegisterScreen from '../screen/RegisterScreen';
import CreatePassword from '../screen/CreatePassword';
import SplashScreen from '../screen/SplashScreen';
import ForgetPassword from '../screen/ForgetPassword';
import ForgetPasswordOTP from '../screen/ForgetPasswordOTP';
import HomeScreen from '../screen/HomeScreen';
import FindBloodDoner from '../bloodDonation/FindBloodDoner';
import MyHistory from '../bloodDonation/MyHistory';
import MyProfile from '../screen/MyProfile';
import UpdateProfile from '../screen/UpdateProfile';
import ResetPassword from '../screen/ResetPassword';
import ForgetCreatePassword from '../screen/ForgetCreatePassword';

const LogoutNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="LoginWithEmail" component={LoginWithEmail} />
      <Stack.Screen name="LoginWithPassword" component={LoginWithPassword} />
      <Stack.Screen name="OtpVerification" component={OtpVerification} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="CreatePassword" component={CreatePassword} />
      <Stack.Screen name="ForgetPassword" component={ForgetPassword} />
      <Stack.Screen name="ForgetPasswordOTP" component={ForgetPasswordOTP} />
      <Stack.Screen
        name="ForgetCreatePassword"
        component={ForgetCreatePassword}
      />
    </Stack.Navigator>
  );
};

const LoginNavigator = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="FindBloodDoner" component={FindBloodDoner} />
      <Stack.Screen name="MyHistory" component={MyHistory} />
      <Stack.Screen name="MyProfile" component={MyProfile} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="ResetPassword" component={ResetPassword} />
    </Stack.Navigator>
  );
};

export {LoginNavigator, LogoutNavigator};
