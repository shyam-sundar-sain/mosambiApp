/* eslint-disable prettier/prettier */
/* eslint-disable react/no-unstable-nested-components */
import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerLayout from './DrawerLayout';
import HomeScreen from '../screen/HomeScreen';
import FindBloodDoner from '../bloodDonation/FindBloodDoner';
import MyHistory from '../bloodDonation/MyHistory';
import MyProfile from '../screen/MyProfile';
import RequestHistory from '../bloodDonation/RequestHistory';
import GameListScreen from '../game/GameListScreen';
import QuizPlayScreen from '../game/QuizPlayScreen';
import GenerateCertificate from '../bloodDonation/GenerateCertificate';
import MyCertificates from '../bloodDonation/MyCertificates';
import ResultScreen from '../game/ResultScreen';
import WalletScreen from '../screen/WalletScreen';
import UpdateProfile from '../screen/UpdateProfile';
import RedeemScreen from '../screen/ReedeemScreen';
import RedeemListScreen from '../screen/ReedeemListScreen';
import ShareScreen from '../screen/ShareScreen';

const Stack = createNativeStackNavigator();
const GameNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="GameListScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="GameListScreen" component={GameListScreen} />
      <Stack.Screen name="QuizPlayScreen" component={QuizPlayScreen} />
      <Stack.Screen name="ResultScreen" component={ResultScreen} />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyProfileScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyProfileScreen" component={MyProfile} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
    </Stack.Navigator>
  );
};

const MyHistoryStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyHistoryScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="MyHistoryScreen" component={MyHistory} />
      <Stack.Screen
        name="GenerateCertificate"
        component={GenerateCertificate}
      />
    </Stack.Navigator>
  );
};

const WalletStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="MyHistoryScreen"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="WalletScreen" component={WalletScreen} />
      <Stack.Screen name="RedeemListScreen" component={RedeemListScreen} />
      <Stack.Screen name="RedeemScreen" component={RedeemScreen} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = props => {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, unmountOnBlur: true}}
      drawerContent={props => <DrawerLayout {...props} />}>
      <Drawer.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{drawerLabel: 'Home'}}
      />
      <Drawer.Screen
        name="MyProfile"
        component={ProfileStack}
        options={{drawerLabel: 'My Profile'}}
      />
      <Drawer.Screen
        name="FindBloodDoner"
        component={FindBloodDoner}
        options={{drawerLabel: 'Find Blood Doner'}}
      />
      <Drawer.Screen
        name="MyHistory"
        component={MyHistoryStack}
        options={{drawerLabel: 'My History'}}
      />
      <Drawer.Screen
        name="RequestHistory"
        component={RequestHistory}
        options={{drawerLabel: 'My Request'}}
      />
      <Drawer.Screen
        name="MyCertificate"
        component={MyCertificates}
        options={{drawerLabel: 'My Certificate'}}
      />
      <Drawer.Screen
        name="Games"
        component={GameNavigator}
        options={{drawerLabel: 'Games'}}
      />
      <Drawer.Screen
        name="Wallet"
        component={WalletStack}
        options={{drawerLabel: 'Wallet'}}
      />
      <Drawer.Screen
        name="Share"
        component={ShareScreen}
        options={{drawerLabel: 'Share'}}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({});
